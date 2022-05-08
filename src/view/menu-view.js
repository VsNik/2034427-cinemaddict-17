import AbstractView from '../framework/view/abstract-view.js';

const createMenuTemplate = (filters) => {

  const filterItems = filters.map((it) => (`
    <a href="#${it.name.toLowerCase()}" class="main-navigation__item">
        ${it.name}
        <span class="main-navigation__item-count">${it.count}</span>
    </a>`
  )).join('');

  return `
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterItems}
    </nav>`;
};

export default class MenuView extends AbstractView{

  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }
}
