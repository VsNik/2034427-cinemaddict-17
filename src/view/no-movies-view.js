import {createElement} from '../render.js';

const createNoMoviesTemplate = (message) => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${message}</h2>
    </section>
  </section>`;

export default class NoMoviesView {

  #element = null;
  #message = null;

  constructor(message) {
    this.#message = message;
  }

  get template() {
    return createNoMoviesTemplate(this.#message);
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
