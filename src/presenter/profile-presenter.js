import ProfileView from '../view/profile-view.js';
import {getUserRang} from '../utils/user-rang.js';
import {remove, render, replace} from '../framework/render.js';

export default class ProfilePresenter {

  #moviesModel;
  #container;
  #movies = [];
  #profileComponent = null;

  constructor(container, moviesModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#movies = this.#moviesModel.movies;
    const rating = getUserRang(this.#movies);

    if (rating) {
      this.#renderProfile(rating);
      return;
    }

    remove(this.#profileComponent);
    this.#profileComponent = null;
  };

  #renderProfile = (rating) => {
    const prevProfileComponent = this.#profileComponent;
    this.#profileComponent = new ProfileView(rating);

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#container);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
