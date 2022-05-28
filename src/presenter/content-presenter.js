import ContentView from '../view/content-view.js';
import SortingView from '../view/sorting-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import ListPresenter from './list-presenter.js';
import ListExtraPresenter from './list-extra-presenter.js';
import {render} from '../framework/render.js';
import {SortType, UpdateType, UserAction} from '../constant.js';

const EmptyContentMessage = {
  MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

export default class ContentPresenter {

  #container;
  #moviesModel;
  #commentsModel;
  #listPresenter;
  #listExtraPresenter;
  #contentComponent = new ContentView();
  #handleOpenPopup;
  #handleRefreshPopup;
  #currentSortType = SortType.DEFAULT;

  constructor(container, moviesModel, commentsModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return this.#moviesModel.sortingDate;
      case SortType.RATING:
        return this.#moviesModel.sortingRating;
    }
    return this.#moviesModel.movies;
  }

  init = (handleOpenPopup, handleRefreshPopup) => {
    if (!this.movies.length) {
      this.#renderNoMovies();
    }

    this.#handleOpenPopup = handleOpenPopup;
    this.#handleRefreshPopup = handleRefreshPopup;

    this.#renderSort();
    render(this.#contentComponent, this.#container);

    this.#listPresenter = new ListPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);
    this.#listExtraPresenter = new ListExtraPresenter(this.#contentComponent, this.#handleOpenPopup, this.handleViewAction);

    this.#listPresenter.render(this.movies);
    this.#listExtraPresenter.render(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
  };

  handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data)
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateData(this.#listPresenter, data, this.#commentsModel.getCommentsByIds(data.comments));
        this.#updateData(this.#listExtraPresenter, data, this.#commentsModel.getCommentsByIds(data.comments));
        this.#listPresenter.update(this.movies);
        break;
      case UpdateType.MINOR:
        this.#listPresenter.update(this.movies);
        break;
    }
  };

  #renderNoMovies = () => {
    const noMoviesComponent = new NoMoviesView(EmptyContentMessage.MOVIES);
    render(noMoviesComponent, this.#container);
  };

  #renderSort = () => {
    const sortComponent = new SortingView();
    render(sortComponent, this.#container);
    sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #updateData = (listPresenter, updatedMovie, comments) => {
    listPresenter.getMoviePresenters().forEach((presenter) => {
      if (presenter.movieId === updatedMovie.id) {
        presenter.init(updatedMovie, comments);
        this.#handleRefreshPopup(updatedMovie);
      }
    });
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#listPresenter.update(this.movies);
  };
}

