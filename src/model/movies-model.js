import {createMovies} from '../mock/movie-mock.js';
import SortingExtra from '../utils/sorting-extra.js';

const MOVIES_COUNT = 17;
const MOVIES_RATED_COUNT = 2;
const MOVIES_COMMENTED_COUNT = 2;

export default class MoviesModel {

  #movies = createMovies(MOVIES_COUNT);

  get movies() {
    return this.#movies;
  }

  get topRating() {
    const sorting = new SortingExtra(this.#movies);
    return sorting.sortByBating(MOVIES_RATED_COUNT);
  }

  get topCommentsCount() {
    const sorting = new SortingExtra(this.#movies);
    return sorting.sortByCommentsCount(MOVIES_COMMENTED_COUNT);
  }
}
