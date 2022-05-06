import AbstractView from '../framework/view/abstract-view.js';

const createNoMoviesTemplate = (message) => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${message}</h2>
    </section>
  </section>`;

export default class NoMoviesView extends AbstractView {

  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createNoMoviesTemplate(this.#message);
  }
}
