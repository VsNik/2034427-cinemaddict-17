import ContentView from '../view/content-view.js';
import SortingView from '../view/sorting-view.js';
import ListPresenter from './list-presenter.js';
import ListExtraPresenter from './list-extra-presenter.js';
import {FilterTypes, SortType, UpdateType, UserAction} from '../constant.js';
import {remove, render, replace} from '../framework/render.js';
import {getFilter} from '../utils/filter.js';

export default class ContentPresenter {

  #container;
  #moviesModel;
  #commentsModel;
  #filterModel;
  #listPresenter;
  #listExtraPresenter;
  #handleOpenPopup;
  #handleRefreshPopup;
  #sortComponent = null;
  #contentComponent = new ContentView();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterTypes.ALL;

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

  init = (handleOpenPopup, handleRefreshPopup) => {
    this.#handleOpenPopup = handleOpenPopup;
    this.#handleRefreshPopup = handleRefreshPopup;

    render(this.#contentComponent, this.#container);

    if (this.movies.length) {
      this.#renderSort();
    }

    this.#listPresenter = new ListPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction, this.#filterModel);
    this.#listExtraPresenter = new ListExtraPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);

    this.#listPresenter.render(this.movies);
    this.#listExtraPresenter.render(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
  };

  handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.REMOVE_COMMENT:
        this.#commentsModel.removeComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#listPresenter.update(this.movies, {resetRenderedMoviesCount: false});
        this.#updateData(this.#listExtraPresenter, data, this.#commentsModel.getCommentsByIds(data.comments));
        break;
      case UpdateType.MINOR:
        this.#listPresenter.update(this.movies);
        this.#updateSort();
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

  #updateSort = () => {
    this.#currentSortType = SortType.DEFAULT;

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

