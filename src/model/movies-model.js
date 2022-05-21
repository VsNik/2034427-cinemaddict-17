import {createMovies} from '../mock/movie-mock.js';
import {sortByDate, sortByRating, sortByComments} from '../utils/sorting.js';
import {MOVIES_COUNT, MOVIES_RATED_COUNT, MOVIES_COMMENTED_COUNT} from '../constant.js';

export default class MoviesModel {

  #movies = createMovies(MOVIES_COUNT);
  #moviesRatingSorted = [];
  #moviesDateSorted = [];

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
    if (!this.#moviesDateSorted.length) {
      this.#moviesDateSorted = sortByDate([...this.#movies]);
    }
    return this.#moviesDateSorted;
  }

  get sortingRating() {
    if (!this.#moviesRatingSorted.length) {
      this.#moviesRatingSorted = sortByRating([...this.#movies]);
    }
    return this.#moviesRatingSorted;
  }
}
