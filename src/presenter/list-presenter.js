import MovieListView from '../view/movie-list-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import BaseListsPresenter from './base-lists-presenter.js';
import {SHOW_MOVIES_COUNT} from '../constant.js';
import {render, remove} from '../framework/render.js';

export default class ListPresenter extends BaseListsPresenter{

  #container;
  #movies = [];
  #movieListComponent = new MovieListView();
  #moviesContainerComponent = new MovieContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedMovieCount = SHOW_MOVIES_COUNT;

  constructor(container, handleOpenPopup, handleViewAction) {
    super();
    this.#container = container;
    this._handleViewAction = handleViewAction;
    this._handleOpenPopup = handleOpenPopup;
    this.#init();
  }

  render = (moviesList) => {
    this.#movies = moviesList;
    const moviesCount = this.#movies.length;
    const movies = this.#movies.slice(0, Math.min(moviesCount, SHOW_MOVIES_COUNT));
    this._renderMovies(this.#moviesContainerComponent, movies);

    if (moviesCount > SHOW_MOVIES_COUNT) {
      this.#renderLoadMoreButton();
    }
  };

  update = (movies) => {
    this._moviePresenters.forEach((presenter) => presenter.destroy());
    this._moviePresenters = [];
    this.#renderedMovieCount = SHOW_MOVIES_COUNT;
    remove(this.#loadMoreButtonComponent);
    this.render(movies);
  };

  #init = () => {
    render(this.#movieListComponent, this.#container.element);
    render(this.#moviesContainerComponent, this.#movieListComponent.element);
  };

  #onLoadMoreButtonClick = () => {
    const moviesCount = this.#movies.length;
    const newRenderMoviesCount = Math.min(moviesCount, this.#renderedMovieCount + SHOW_MOVIES_COUNT);
    const movies = this.#movies.slice(this.#renderedMovieCount, newRenderMoviesCount);

    this._renderMovies(this.#moviesContainerComponent, movies);
    this.#renderedMovieCount = newRenderMoviesCount;

    if (this.#renderedMovieCount >= moviesCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#movieListComponent.element);
    this.#loadMoreButtonComponent.handleShowMoreClick(this.#onLoadMoreButtonClick);
  };
}
