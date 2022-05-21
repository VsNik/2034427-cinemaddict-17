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

  constructor(container, handleChangeData, handleOpenPopup) {
    super();
    this.#container = container;
    this._handleChangeData = handleChangeData;
    this._handleOpenPopup = handleOpenPopup;

    this.#init();
  }

  render = (movies) => {
    this.#movies = movies;
    this._renderMovies(this.#moviesContainerComponent, this.#movies, 0, this.#renderedMovieCount);

    if (this.#movies.length > SHOW_MOVIES_COUNT) {
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
    this._renderMovies(
      this.#moviesContainerComponent,
      this.#movies,
      this.#renderedMovieCount,
      this.#renderedMovieCount + SHOW_MOVIES_COUNT
    );

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
