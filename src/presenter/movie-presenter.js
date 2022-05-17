import MovieView from '../view/movie-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class MoviePresenter {

  #container;
  #changeData;
  #handleOpenPopup;
  #movie = null;
  #movieComponent = null;

  constructor(container, changeData, handleOpenPopup) {
    this.#container = container;
    this.#changeData = changeData;
    this.#handleOpenPopup = handleOpenPopup;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;
    this.#movieComponent = new MovieView(movie);

    this.#movieComponent.setOpenPopupClickHandler(() => this.#handleOpenPopup(this.#movie));
    this.#movieComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#container);
      return;
    }

    replace(this.#movieComponent, prevMovieComponent);
    remove(prevMovieComponent);
  };

  getMovieId = () => this.#movie?.id;

  destroy = () => {
    remove(this.#movieComponent);
  };

  #handleWatchListClick = () => {
    const newUserDetails = {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist};
    this.#changeData({...this.#movie, userDetails: newUserDetails});
  };

  #handleWatchedClick = () => {
    const newUserDetails = {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched};
    this.#changeData({...this.#movie, userDetails: newUserDetails});
  };

  #handleFavoriteClick = () => {
    const newUserDetails = {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite};
    this.#changeData({...this.#movie, userDetails: newUserDetails});
  };
}

