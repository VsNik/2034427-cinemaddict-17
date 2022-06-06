import AbstractView from '../framework/view/abstract-view.js';
import {FilterTypes} from '../constant.js';

const createMenuTemplate = (filters, currentFilterType) => {

  const filterItems = filters.map((filter) => (`
    <a
        href="#${filter.name.toLowerCase()}"
        class="main-navigation__item ${currentFilterType === filter.name ? 'main-navigation__item--active' : ''}"
        data-filter-type="${filter.name}"
    >
        ${filter.name}
        <span class="main-navigation__item-count" data-filter-type="${filter.name}">${filter.count}</span>
    </a>`
  )).join('');

  return `
    <nav class="main-navigation">
      <a
        href="#all"
        class="main-navigation__item ${currentFilterType === FilterTypes.ALL ? 'main-navigation__item--active' : ''}"
        data-filter-type="${FilterTypes.ALL}"
      >
        ${FilterTypes.ALL}
      </a>
        ${filterItems}
    </nav>`;
};

export default class MenuView extends AbstractView{

  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  };
}
