import {createElement} from '../render.js';

const createMovieContainerTemplate = () =>
  '<div class="films-list__container"></div>';

export default class MovieContainerView {

  #element = null;

  get template() {
    return createMovieContainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
