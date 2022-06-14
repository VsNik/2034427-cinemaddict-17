import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../constant.js';

const NoContentMessage = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
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
