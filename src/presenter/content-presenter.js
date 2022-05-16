import MovieListView from '../view/movie-list-view.js';
import ContentView from '../view/content-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import MovieListExtraView from '../view/movie-list-extra-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import SortingView from '../view/sorting-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import MoviePresenter from './movie-presenter.js';
import {render, remove} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

const EmptyContentMessage = {
  MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

const SHOW_MOVIES_COUNT = 5;

export default class ContentPresenter {

  #container;
  #movies = [];
  #moviesModel;
  #commentsModel;
  #contentComponent = new ContentView();
  #movieListComponent = new MovieListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #movieContainerComponent = new MovieContainerView();
  #renderedMovieCount = SHOW_MOVIES_COUNT;
  #moviePresenters = [];

  constructor(container, moviesModel, commentsModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#movies = this.#moviesModel.movies.slice();
    this.#renderContent();
  };

  #renderContent = () => {
    if (!this.#movies.length) {
      this.#renderNoMovies();
      return;
    }

    render(new SortingView(), this.#container);
    render(this.#contentComponent, this.#container);

    this.#renderMoviesList();
    this.#renderExtraMovieList(new MovieListExtraView(Titles.RATED), this.#moviesModel.topRating);
    this.#renderExtraMovieList(new MovieListExtraView(Titles.COMMENTED), this.#moviesModel.topCommentsCount);
  };

  #renderMoviesList = () => {
    render(this.#movieListComponent, this.#contentComponent.element);
    render(this.#movieContainerComponent, this.#movieListComponent.element);

    this.#renderMovies(0, Math.min(this.#movies.length, SHOW_MOVIES_COUNT));

    if (this.#movies.length > SHOW_MOVIES_COUNT) {
      this.#renderLoadMoreButton();
    }
  };

  #renderExtraMovieList = (listContainer, movies) => {
    if (movies.length) {
      const movieContainer = new MovieContainerView();
      render(listContainer, this.#contentComponent.element);
      render(movieContainer, listContainer.element);

      movies.forEach((it) => {
        this.#renderMovieItem(movieContainer, it);
      });
    }
  };

  #renderMovies = (from, to) => {
    this.#movies.slice(from, to).forEach((it) => {
      this.#renderMovieItem(this.#movieContainerComponent, it);
    });
  };

  #onLoadMoreButtonClick = () => {
    this.#renderMovies(this.#renderedMovieCount, this.#renderedMovieCount + SHOW_MOVIES_COUNT);
    this.#renderedMovieCount += SHOW_MOVIES_COUNT;

    if (this.#renderedMovieCount >= this.#movies.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#movieListComponent.element);
    this.#loadMoreButtonComponent.handleShowMoreClick(this.#onLoadMoreButtonClick);
  };

  #renderMovieItem = (movieContainer, movie) => {
    const bodyElement = this.#container.parentNode;
    const movieComments = this.#commentsModel.getCommentsByIds(movie.comments);

    const moviePresenter = new MoviePresenter(bodyElement, movieContainer, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie, movieComments);
    this.#moviePresenters.push(moviePresenter);
  };

  #renderNoMovies = () => {
    const noMoviesComponent = new NoMoviesView(EmptyContentMessage.MOVIES);
    render(noMoviesComponent, this.#container);
  };

  #handleMovieChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    const comments = this.#commentsModel.getCommentsByIds(updatedMovie.comments);

    this.#moviePresenters.forEach((presenter) => {
      if (presenter.getMovieId() === updatedMovie.id) {
        presenter.init(updatedMovie, comments);
      }
    });
  };

  #handleModeChange = () => {
    this.#moviePresenters.forEach((presenter) => presenter.resetView());
  };
}

