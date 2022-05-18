import ContentView from '../view/content-view.js';
import SortingView from '../view/sorting-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import MoviePresenter from './movie-presenter.js';
import ListPresenter from './list-presenter.js';
import ListExtraPresenter from './list-extra-presenter.js';
import {render} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../constant.js';

const EmptyContentMessage = {
  MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

export default class ContentPresenter {

  #container;
  #movies = [];
  #sourceMovies = [];
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
    this.#movies = moviesModel.movies;
    this.#sourceMovies = [...this.#movies];
  }

  init = (handleOpenPopup, handleRefreshPopup) => {
    if (!this.#movies.length) {
      this.#renderNoMovies();
    }

    this.#handleOpenPopup = handleOpenPopup;
    this.#handleRefreshPopup = handleRefreshPopup;

    this.#renderSort();
    render(this.#contentComponent, this.#container);

    this.#listPresenter = new ListPresenter(this.#contentComponent, this.#renderMovieItem, this.#moviesModel);
    this.#listExtraPresenter = new ListExtraPresenter(this.#contentComponent, this.#renderMovieItem);

    this.#listPresenter.render(this.#movies);
    this.#listExtraPresenter.render(this.#moviesModel.topRating, this.#moviesModel.topCommentsCount);
  };

  handleChangeData = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    const comments = this.#commentsModel.getCommentsByIds(updatedMovie.comments);

    this.#updateData(this.#listPresenter, updatedMovie, comments);
    this.#updateData(this.#listExtraPresenter, updatedMovie, comments);
  };

  #renderMovieItem = (movieContainer, movie) => {
    const moviePresenter = new MoviePresenter(movieContainer, this.handleChangeData, this.#handleOpenPopup);
    moviePresenter.init(movie);
    return moviePresenter;
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
      if (presenter.getMovieId() === updatedMovie.id) {
        presenter.init(updatedMovie, comments);
        this.#handleRefreshPopup(updatedMovie);
      }
    });
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movies = this.#moviesModel.sortingDate;
        break;
      case SortType.RATING:
        this.#movies = this.#moviesModel.sortingRating;
        break;
      default:
        this.#movies = this.#sourceMovies;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#listPresenter.clear();
    this.#listPresenter.render(this.#movies);
  };
}

