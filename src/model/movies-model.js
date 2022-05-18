import {createMovies} from '../mock/movie-mock.js';
import {sort, handleRatingSort, handleCommentsSort, handleDateSort} from '../utils/sorting.js';
import {MOVIES_COUNT, MOVIES_RATED_COUNT, MOVIES_COMMENTED_COUNT} from '../constant.js';

export default class MoviesModel {

  #movies = createMovies(MOVIES_COUNT);
  #moviesRatingSort = [];
  #moviesCommentsSort = [];

  get movies() {
    return this.#movies;
  }

  get topRating() {
    return sort(this.#movies, handleRatingSort, MOVIES_RATED_COUNT)
      .filter((movie) => movie.filmInfo.totalRating !== 0);
  }

  get topCommentsCount() {
    return sort(this.#movies, handleCommentsSort, MOVIES_COMMENTED_COUNT)
      .filter((movie) => movie.comments.length !== 0);
  }

  get sortingDate() {
    if (!this.#moviesRatingSort.length) {
      this.#moviesRatingSort = sort(this.#movies, handleDateSort, this.#movies.length);
    }
    return this.#moviesRatingSort;
  }

  get sortingRating() {
    if (!this.#moviesCommentsSort.length) {
      this.#moviesCommentsSort = sort(this.#movies, handleRatingSort, this.#movies.length);
    }
    return this.#moviesCommentsSort;
  }
}
