import MovieListExtraView from '../view/movie-list-extra-view';
import MovieContainerView from '../view/movie-container-view';
import BaseListsPresenter from './base-lists-presenter.js';
import {render} from '../framework/render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

export default class ListExtraPresenter extends BaseListsPresenter {

  #container;
  #ratedContainerComponent;
  #commentedContainerComponent;

  constructor(container, handleOpenPopup, handleViewAction) {
    super();
    this.#container = container;
    this._handleViewAction = handleViewAction;
    this._handleOpenPopup = handleOpenPopup;

    this.#init();
  }

  render = (moviesRated, moviesComments) => {
    this._renderMovies(this.#ratedContainerComponent, moviesRated);
    this._renderMovies(this.#commentedContainerComponent, moviesComments);
  };

  #init = () => {
    const ratedListComponent = new MovieListExtraView(Titles.RATED);
    this.#ratedContainerComponent = new MovieContainerView();
    render(ratedListComponent, this.#container.element);
    render(this.#ratedContainerComponent, ratedListComponent.element);

    const commentedListComponent = new MovieListExtraView(Titles.COMMENTED);
    this.#commentedContainerComponent = new MovieContainerView();
    render(commentedListComponent, this.#container.element);
    render(this.#commentedContainerComponent, commentedListComponent.element);
  };
}
