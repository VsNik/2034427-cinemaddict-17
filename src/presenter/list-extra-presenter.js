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

    this.#ratedContainerComponent = new MovieContainerView();
    this.#commentedContainerComponent = new MovieContainerView();
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

  #initRated = () => {
    const ratedListComponent = new MovieListExtraView(Titles.RATED);
    render(ratedListComponent, this.#container.element);
    render(this.#ratedContainerComponent, ratedListComponent.element);
  };

  #initCommented = () => {
    const commentedListComponent = new MovieListExtraView(Titles.COMMENTED);
    render(commentedListComponent, this.#container.element);
    render(this.#commentedContainerComponent, commentedListComponent.element);
  };
}
