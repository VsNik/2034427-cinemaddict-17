import AbstractView from '../framework/view/abstract-view.js';
import {FilterTypes} from '../constant.js';

const NoContentMessage = {
  [FilterTypes.ALL]: 'There are no movies in our database',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (filterType) => {

  const noContentMessage = NoContentMessage[filterType];

  return(`
    <section class="films-list">
      <h2 class="films-list__title">${noContentMessage}</h2>
    </section>`
  );
};

export default class NoMoviesView extends AbstractView {

  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoMoviesTemplate(this.#filterType);
  }
}
