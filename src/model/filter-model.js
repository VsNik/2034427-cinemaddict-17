import Observable from '../framework/observable.js';
import {FilterTypes} from '../constant.js';

export default class FilterModel extends Observable {

  #filter = FilterTypes.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
