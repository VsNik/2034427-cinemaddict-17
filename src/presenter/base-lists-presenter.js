import MoviePresenter from './movie-presenter.js';

export default class BaseListsPresenter {

  _moviePresenters = [];
  _handleChangeData;
  _handleOpenPopup;

  getMoviePresenters = () => this._moviePresenters;

  _renderMovies = (container, movies, from, to) => {
    movies.slice(from, to).forEach((movie) => {
      const presenter = this._renderMovie(container.element, movie);
      this._moviePresenters.push(presenter);
    });
  };

  _renderMovie = (movieContainer, movie) => {
    const moviePresenter = new MoviePresenter(movieContainer, this._handleChangeData, this._handleOpenPopup);
    moviePresenter.init(movie);
    return moviePresenter;
  };
}

