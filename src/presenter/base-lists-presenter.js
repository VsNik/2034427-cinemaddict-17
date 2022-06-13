import MoviePresenter from './movie-presenter.js';

export default class BaseListsPresenter {

  _moviePresenters = new Map();
  _handleViewAction;
  _handleOpenPopup;

  getMoviePresenters = () => this._moviePresenters;

  _renderMovies = (container, movies) => {
    movies.forEach((movie) => (this._renderMovie(container.element, movie)));
  };

  _renderMovie = (movieContainer, movie) => {
    const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleOpenPopup);
    moviePresenter.init(movie);
    this._moviePresenters.set(movie.id, moviePresenter);
  };
}

