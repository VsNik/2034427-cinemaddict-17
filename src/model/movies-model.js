import Observable from '../framework/observable.js';
import {sortByDate, sortByRating} from '../utils/sorting.js';
import {MOVIES_RATED_COUNT, MOVIES_COMMENTED_COUNT, UpdateType} from '../constant.js';
import {adaptToClient} from '../adapter.js';
import {getTopCommentsCount, getTopRated} from '../utils/top-movies.js';

export default class MoviesModel extends Observable {

  #movieApiService = null;
  #movies = [];

  constructor(movieApiService) {
    super();
    this.#movieApiService = movieApiService;
  }

  get movies() {
    return this.#movies;
  }

  get topRating() {
    return getTopRated([...this.movies], MOVIES_RATED_COUNT)
      .filter((movie) => movie.filmInfo.totalRating !== 0);
  }

  get topCommentsCount() {
    return getTopCommentsCount([...this.movies], MOVIES_COMMENTED_COUNT)
      .filter((movie) => movie.comments.length !== 0);
  }

  get sortingDate() {
    return  sortByDate([...this.#movies]);
  }

  get sortingRating() {
    return sortByRating([...this.#movies]);
  }

  init = async () => {
    try {
      const movies = await this.#movieApiService.movies;
      this.#movies = movies.map(adaptToClient);
    } catch (err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#getUpdateIndex(update);

    try {
      const response = await this.#movieApiService.updateMovie(update);
      const updateMovie = adaptToClient(response);
      this.#updateData(update, index);
      this._notify(updateType, updateMovie);
    } catch (err) {
      throw new Error('Can\'t update movie');
    }
  };

  handleChangeData = (update) => {
    const index = this.#getUpdateIndex(update);
    this.#updateData(update, index);
  };

  #getUpdateIndex = (update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    return index;
  };

  #updateData = (update, index) => {
    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];
  };
}
