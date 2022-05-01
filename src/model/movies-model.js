import {createMovies} from '../mock/movie-mock.js';

const MOVIES_COUNT = 15;

export default class MoviesModel {

  movies = createMovies(MOVIES_COUNT);

  getMovies() {
    return this.movies;
  }
}
