import MovieListExtraView from '../view/movie-list-extra-view';
import MovieContainerView from '../view/movie-container-view';
import BaseListsPresenter from './base-lists-presenter.js';
import {render} from '../framework/render.js';

const TITLE = 'Top rated';

export default class ListRatedPresenter extends BaseListsPresenter {

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

  render = (movies) => {
    if (movies.length) {
      this.#init();
      this._renderMovies(this.#containerComponent, movies);
    }
  };

  #init = () => {
    this.#containerComponent = new MovieContainerView();
    render(this.#listComponent, this.#container.element);
    render(this.#containerComponent, this.#listComponent.element);
  };
}
