import {createElement} from '../render.js';

const createContentTemplate = () =>
  '<section class="films"></section>';

export default class ContentView {

  #element = null;

  get template() {
    return createContentTemplate();
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
