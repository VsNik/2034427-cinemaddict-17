import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {SortType} from '../constant.js';

const createSortingTemplate = (sortType) => `
  <ul class="sort">
    <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;

export default class SortingView extends AbstractStatefulView {

  constructor() {
    super();
    this._state = {...this._state, currentSortType: SortType.DEFAULT};
  }

  get template() {
    return createSortingTemplate(this._state.currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  _restoreHandlers = () => {
    this.setSortTypeChangeHandler(this._callback.sortTypeChange);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this.updateElement({...this._state, currentSortType: evt.target.dataset.sortType});
  };
}

