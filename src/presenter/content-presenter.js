import ContentView from '../view/content-view.js';
import SortingView from '../view/sorting-view.js';
import LoadingView from '../view/loading-view.js';
import ListPresenter from './list-presenter.js';
import ListRatedPresenter from './list-rated-presenter.js';
import ListCommentedPresenter from './list-commented-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {FilterType, SortType, UpdateType, UserAction} from '../constant.js';
import {remove, render, RenderPosition, replace} from '../framework/render.js';
import {getFilter} from '../utils/filter.js';

const MIN_MOVIES_TO_SORT = 2;

const TimeLimit = {
  LOWER_LIMIT: 50,
  UPPER_LIMIT: 500,
};

export default class ContentPresenter {

  #container;
  #moviesModel;
  #commentsModel;
  #filterModel;
  #listPresenter;
  #listRatedPresenter;
  #listCommentedPresenter;
  #handleOpenPopup;
  #handleUpdatePopup;
  #handlePopupIsAborting;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #contentComponent = new ContentView();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
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

  init = (handleOpenPopup, handleUpdatePopup, handlePopupIsAborting) => {
    this.#handleOpenPopup = handleOpenPopup;
    this.#handleUpdatePopup = handleUpdatePopup;
    this.#handlePopupIsAborting = handlePopupIsAborting;

    this.#listPresenter = new ListPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction, this.#filterModel);
    this.#listRatedPresenter = new ListRatedPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);
    this.#listCommentedPresenter = new ListCommentedPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);

    render(this.#contentComponent, this.#container);
    this.#renderLoading();
  };

  handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch (err) {
          this.#setMovieAborting(this.#listPresenter, update.id);
          this.#setMovieAborting(this.#listRatedPresenter, update.id);
          this.#setMovieAborting(this.#listCommentedPresenter, update.id);
          this.#handlePopupIsAborting();
        }
        break;
      case UserAction.REMOVE_COMMENT:
        try {
          this.#uiBlocker.block();
          await this.#commentsModel.removeComment(updateType, update);
        } catch (err) {
          this.#handlePopupIsAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#uiBlocker.block();
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

    this.#listPresenter.render(this.movies);
    this.#listRatedPresenter.render(this.#moviesModel.topRating);
    this.#listCommentedPresenter.render(this.#moviesModel.topCommentsCount);
  };

  #getMoviePresenter = (listPresenter, movieId) => listPresenter.getMoviePresenters().get(movieId);

  #setMovieAborting = (listPresenter, movieId) => {
    const moviePresenter = this.#getMoviePresenter(listPresenter, movieId);
    if (moviePresenter) {
      moviePresenter.handleIsAborting();
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handleUpdatePopup(data);
        this.#updateData(this.#listPresenter, data, this.#commentsModel.comments);
        this.#updateData(this.#listRatedPresenter, data, this.#commentsModel.comments);
        this.#updateData(this.#listCommentedPresenter, data, this.#commentsModel.comments);
        this.#listPresenter.update(this.movies, {resetRenderedMoviesCount: false});
        this.#updateSort();
        break;
      case UpdateType.MINOR:
        this.#updateSort({resetSort: true});
        this.#listPresenter.update(this.movies);
        break;
      case UpdateType.MAJOR:
        this.#handleUpdatePopup(this.#commentsModel.commentedMovie);
        this.#listPresenter.update(this.movies, {resetRenderedMoviesCount: false});
        this.#listCommentedPresenter.update(this.#moviesModel.topCommentsCount);
        this.#updateData(this.#listPresenter, this.#commentsModel.commentedMovie, this.#commentsModel.comments);
        this.#updateData(this.#listRatedPresenter, this.#commentsModel.commentedMovie, this.#commentsModel.comments);
        this.#updateData(this.#listCommentedPresenter, this.#commentsModel.commentedMovie, this.#commentsModel.comments);
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };

  #updateData = (listPresenter, updatedMovie, comments) => {
    const presenter = this.#getMoviePresenter(listPresenter, updatedMovie.id);
    if (presenter) {
      presenter.init(updatedMovie, comments);
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#contentComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  #updateSort = ({resetSort = false} = {}) => {
    if (resetSort) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.movies.length < MIN_MOVIES_TO_SORT) {
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

