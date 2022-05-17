import MovieListView from '../view/movie-list-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {SHOW_MOVIES_COUNT} from '../constant.js';
import {render, remove} from '../framework/render.js';

export default class ListPresenter {

  #container;
  #renderMovie;
  #movies = [];
  #moviePresenters = [];
  #movieListComponent = new MovieListView();
  #moviesContainerComponent = new MovieContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedMovieCount = SHOW_MOVIES_COUNT;

  constructor(container, renderMovie) {
    this.#container = container;
    this.#renderMovie = renderMovie;

    this.#init();
  }

  render = (movies) => {
    this.#movies = movies;
    this.#renderMovies(0, this.#renderedMovieCount);

    if (this.#movies.length > SHOW_MOVIES_COUNT) {
      this.#renderLoadMoreButton();
    }
  };

  getMoviePresenters = () => this.#moviePresenters;

  clear = () => {
    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters = [];
    this.#renderedMovieCount = SHOW_MOVIES_COUNT;
    remove(this.#loadMoreButtonComponent);
  };

  #init = () => {
    render(this.#movieListComponent, this.#container.element);
    render(this.#moviesContainerComponent, this.#movieListComponent.element);
  };

  #renderMovies = (from, to) => {
    this.#movies.slice(from, to).forEach((movie) => {
      const presenter = this.#renderMovie(this.#moviesContainerComponent.element, movie);
      this.#moviePresenters.push(presenter);
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
}
