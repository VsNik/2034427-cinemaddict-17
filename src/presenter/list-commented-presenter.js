import MovieListExtraView from '../view/movie-list-extra-view';
import MovieContainerView from '../view/movie-container-view';
import BaseListsPresenter from './base-lists-presenter.js';
import {remove, render} from '../framework/render.js';

const TITLE = 'Most commented';

export default class ListCommentedPresenter extends BaseListsPresenter {

  #container;
  #containerComponent;
  #listComponent;

  constructor(container, handleOpenPopup, handleViewAction) {
    super();
    this.#container = container;
    this._handleViewAction = handleViewAction;
    this._handleOpenPopup = handleOpenPopup;

    this.#listComponent = new MovieListExtraView(TITLE);
  }

  render = (moviesComments) => {
    if (moviesComments.length) {
      this.#init();
      this._renderMovies(this.#containerComponent, moviesComments);
    }
  };

  update = (movies) => {
    this._moviePresenters.forEach((moviePresenter) => moviePresenter.destroy());
    remove(this.#listComponent);
    this.render(movies);
  };

  #init = () => {
    this.#containerComponent = new MovieContainerView();
    render(this.#listComponent, this.#container.element);
    render(this.#containerComponent, this.#listComponent.element);
  };
}
