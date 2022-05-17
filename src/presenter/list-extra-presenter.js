import MovieListExtraView from '../view/movie-list-extra-view';
import MovieContainerView from '../view/movie-container-view';
import {MOVIES_RATED_COUNT, MOVIES_COMMENTED_COUNT} from '../constant.js';
import {render} from '../framework/render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

export default class ListExtraPresenter {

  #container;
  #renderMovie;
  #moviePresenters = [];
  #ratedContainerComponent;
  #commentedContainerComponent;

  constructor(container, renderMovie) {
    this.#container = container;
    this.#renderMovie = renderMovie;

    this.#init();
  }

  render = (moviesRated, moviesComments) => {
    this.#renderMovies(this.#ratedContainerComponent, moviesRated, MOVIES_RATED_COUNT);
    this.#renderMovies(this.#commentedContainerComponent, moviesComments, MOVIES_COMMENTED_COUNT);
  };

  getMoviePresenters = () => this.#moviePresenters;

  #init = () => {
    const ratedListComponent = new MovieListExtraView(Titles.RATED);
    this.#ratedContainerComponent = new MovieContainerView();
    render(ratedListComponent, this.#container.element);
    render(this.#ratedContainerComponent, ratedListComponent.element);

    const commentedListComponent = new MovieListExtraView(Titles.COMMENTED);
    this.#commentedContainerComponent = new MovieContainerView();
    render(commentedListComponent, this.#container.element);
    render(this.#commentedContainerComponent, commentedListComponent.element);
  };

  #renderMovies = (container, movies, count) => {
    movies.slice(0, count).forEach((movie) => {
      const presenter = this.#renderMovie(container.element, movie);
      this.#moviePresenters.push(presenter);
    });
  };
}
