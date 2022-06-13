import MoviePresenter from './movie-presenter.js';

export default class BaseListsPresenter {

  _moviePresenters = [];
  _handleViewAction;
  _handleOpenPopup;

  getMoviePresenters = () => this._moviePresenters;

  _renderMovies = (container, movies) => {
    for (const movie of movies) {
      const presenter = this._renderMovie(container.element, movie);
      this._moviePresenters.push(presenter);
    }
  };

  _renderMovie = (movieContainer, movie) => {
    const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleOpenPopup);
    moviePresenter.init(movie);
    return moviePresenter;
  };
}

