import Observable from '../framework/observable.js';
import {sortByDate, sortByRating, sortByComments} from '../utils/sorting.js';
import {MOVIES_COUNT, MOVIES_RATED_COUNT, MOVIES_COMMENTED_COUNT} from '../constant.js';
import {createMovies} from '../mock/movie-mock.js';

export default class MoviesModel extends Observable {

  #movies = createMovies(MOVIES_COUNT);

  get movies() {
    return this.#movies;
  }

  get topRating() {
    return sortByRating([...this.#movies]).slice(0, MOVIES_RATED_COUNT)
      .filter((movie) => movie.filmInfo.totalRating !== 0);
  }

  get topCommentsCount() {
    return sortByComments([...this.#movies]).slice(0, MOVIES_COMMENTED_COUNT)
      .filter((movie) => movie.comments.length !== 0);
  }

  get sortingDate() {
    return  sortByDate([...this.#movies]);
  }

  get sortingRating() {
    return sortByRating([...this.#movies]);
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
