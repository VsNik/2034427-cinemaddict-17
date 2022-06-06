import MovieListExtraView from '../view/movie-list-extra-view';
import MovieContainerView from '../view/movie-container-view';
import BaseListsPresenter from './base-lists-presenter.js';
import {remove, render} from '../framework/render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

export default class ListExtraPresenter extends BaseListsPresenter {

  #container;
  #ratedContainerComponent;
  #commentedContainerComponent;
  #ratedListComponent;
  #commentedListComponent;

  constructor(container, handleOpenPopup, handleViewAction) {
    super();
    this.#container = container;
    this._handleViewAction = handleViewAction;
    this._handleOpenPopup = handleOpenPopup;

    this.#ratedListComponent = new MovieListExtraView(Titles.RATED);
    this.#commentedListComponent = new MovieListExtraView(Titles.COMMENTED);
  }

  render = (moviesRated, moviesComments) => {
    if (moviesRated.length) {
      this.#initRated();
      this._renderMovies(this.#ratedContainerComponent, moviesRated);
    }
    if (moviesComments.length) {
      this.#initCommented();
      this._renderMovies(this.#commentedContainerComponent, moviesComments);
    }
  };

  update = (moviesRated, moviesComments) => {
    this._moviePresenters.forEach((presenter) => presenter.destroy());
    this._moviePresenters = [];
    remove(this.#ratedListComponent);
    remove(this.#commentedListComponent);
    this.render(moviesRated, moviesComments);
  };

  #initRated = () => {
    this.#ratedContainerComponent = new MovieContainerView();
    render(this.#ratedListComponent, this.#container.element);
    render(this.#ratedContainerComponent, this.#ratedListComponent.element);
  };

  #initCommented = () => {
    this.#commentedContainerComponent = new MovieContainerView();
    render(this.#commentedListComponent, this.#container.element);
    render(this.#commentedContainerComponent, this.#commentedListComponent.element);
  };
}
