import {createElement} from '../render.js';

const createMovieContainerTemplate = () =>
  '<div class="films-list__container"></div>';

export default class MovieContainerView {

  getTemplate() {
    return createMovieContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
