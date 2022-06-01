import {SortType} from '../constant.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortingTemplate = (sortType) => `
  <ul class="sort">
    <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;

export default class SortingView extends AbstractView {

  #currentSort;

  constructor(sortType) {
    super();
    this.#currentSort = sortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}

