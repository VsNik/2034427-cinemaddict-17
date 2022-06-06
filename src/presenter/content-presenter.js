import ContentView from '../view/content-view.js';
import SortingView from '../view/sorting-view.js';
import LoadingView from '../view/loading-view.js';
import ListPresenter from './list-presenter.js';
import ListExtraPresenter from './list-extra-presenter.js';
import {FilterTypes, SortType, UpdateType, UserAction} from '../constant.js';
import {remove, render, RenderPosition, replace} from '../framework/render.js';
import {getFilter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 50,
  UPPER_LIMIT: 600,
};

export default class ContentPresenter {

  #container;
  #moviesModel;
  #commentsModel;
  #filterModel;
  #listPresenter;
  #listExtraPresenter;
  #handleOpenPopup;
  #handleRefreshPopup;
  #handlePopupIsAborting;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #contentComponent = new ContentView();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterTypes.ALL;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, moviesModel, commentsModel, filterModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;

    switch (this.#currentSortType) {
      case SortType.DATE:
        return getFilter(this.#moviesModel.sortingDate, this.#filterType);
      case SortType.RATING:
        return getFilter(this.#moviesModel.sortingRating, this.#filterType);
    }

    return getFilter(this.#moviesModel.movies, this.#filterType);
  }

  init = (handleOpenPopup, handleRefreshPopup, handlePopupIsAborting) => {
    this.#handleOpenPopup = handleOpenPopup;
    this.#handleRefreshPopup = handleRefreshPopup;
    this.#handlePopupIsAborting = handlePopupIsAborting;

    render(this.#contentComponent, this.#container);
    this.#renderLoading();
  };

  handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch (err) {
          this.#setMovieAborting(this.#listExtraPresenter, update.id);
          this.#setMovieAborting(this.#listPresenter, update.id);
          this.#handlePopupIsAborting();
        }
        break;
      case UserAction.REMOVE_COMMENT:
        try {
          await this.#commentsModel.removeComment(updateType, update);
        } catch (err) {
          this.#handlePopupIsAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch (err) {
          this.#handlePopupIsAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #renderContent = () => {
    if (this.movies.length) {
      this.#renderSort();
    }

    this.#listPresenter = new ListPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction, this.#filterModel);
    this.#listExtraPresenter = new ListExtraPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);

    this.#listPresenter.render(this.movies);
    this.#listExtraPresenter.render(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
  };

  #setMovieAborting = (listPresenter, movieId) => {
    for (const presenter of listPresenter.getMoviePresenters()) {
      if (presenter.movieId === movieId) {
        presenter.handleIsAborting();
        break;
      }
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateData(this.#listPresenter, data, this.#commentsModel.comments);
        this.#updateData(this.#listExtraPresenter, data, this.#commentsModel.comments);
        this.#listPresenter.update(this.movies, {resetRenderedMoviesCount: false});
        this.#listExtraPresenter.update(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
        this.#updateSort();
        break;
      case UpdateType.MINOR:
        this.#listPresenter.update(this.movies);
        this.#updateSort({resetSort: true});
        break;
      case UpdateType.MAJOR:
        this.#listPresenter.update(this.movies, {resetRenderedMoviesCount: false});
        this.#listExtraPresenter.update(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
        this.#updateData(this.#listPresenter, this.#commentsModel.commentedMovie, this.#commentsModel.comments);
        this.#updateData(this.#listExtraPresenter, this.#commentsModel.commentedMovie, this.#commentsModel.comments);
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };

  #updateData = (listPresenter, updatedMovie, comments) => {
    listPresenter.getMoviePresenters().forEach((presenter) => {
      if (presenter.movieId === updatedMovie.id) {
        presenter.init(updatedMovie, comments);
        this.#handleRefreshPopup(updatedMovie);
      }
    });
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    if (prevSortComponent === null) {
      this.#contentComponent.element.before(this.#sortComponent.element);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  #updateSort = ({resetSort = false} = {}) => {
    if (resetSort) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (!this.movies.length) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      return;
    }

    this.#renderSort();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#listPresenter.update(this.movies);
    this.#renderSort();
  };
}

