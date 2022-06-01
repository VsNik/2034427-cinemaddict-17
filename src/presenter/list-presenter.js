import MovieListView from '../view/movie-list-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import BaseListsPresenter from './base-lists-presenter.js';
import {SHOW_MOVIES_COUNT} from '../constant.js';
import {render, remove, RenderPosition, replace} from '../framework/render.js';

export default class ListPresenter extends BaseListsPresenter{

  #container;
  #movies = [];
  #filterModel;
  #noMoviesComponent = null;
  #movieListComponent = null;
  #moviesContainerComponent = new MovieContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedMovieCount = SHOW_MOVIES_COUNT;

  constructor(container, handleOpenPopup, handleViewAction, filterModel) {
    super();
    this.#container = container;
    this._handleViewAction = handleViewAction;
    this._handleOpenPopup = handleOpenPopup;
    this.#filterModel = filterModel;
    this.#init();
  }

  render = (newMovies) => {
    this.#movies = newMovies;

    if (!newMovies.length) {
      const prevNoMoviesComponent = this.#noMoviesComponent;
      this.#noMoviesComponent = new NoMoviesView(this.#filterModel.filter);

      if (prevNoMoviesComponent === null) {
        replace(this.#noMoviesComponent, this.#movieListComponent);
        return;
      }

      replace(this.#noMoviesComponent, prevNoMoviesComponent);
      remove(prevNoMoviesComponent);
      return;
    }

    if (this.#noMoviesComponent !== null) {
      replace(this.#movieListComponent, this.#noMoviesComponent);
      this.#noMoviesComponent = null;
    }

    const movies = this.#movies.slice(0, this.#renderedMovieCount);
    this._renderMovies(this.#moviesContainerComponent, movies);

    if (this.#movies.length > SHOW_MOVIES_COUNT) {
      this.#renderLoadMoreButton();
    }
  };

  update = (movies, {resetRenderedMoviesCount = true} = {}) => {
    this._moviePresenters.forEach((presenter) => presenter.destroy());
    this._moviePresenters = [];

    if (resetRenderedMoviesCount) {
      this.#renderedMovieCount = SHOW_MOVIES_COUNT;
    }

    remove(this.#loadMoreButtonComponent);
    this.render(movies);
  };

  #init = () => {
    this.#movieListComponent = new MovieListView();
    render(this.#movieListComponent, this.#container.element, RenderPosition.BEFOREEND);
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
