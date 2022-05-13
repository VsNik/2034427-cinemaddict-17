import MovieView from '../view/movie-view.js';
import PopupView from '../view/popup-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class MoviePresenter {

  #bodyElement;
  #container;
  #changeData;
  #movie = null;
  #movieComponent = null;
  #popupComponent = null;

  constructor(bodyElement, container, changeData) {
    this.#bodyElement = bodyElement;
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (movie, comments) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#movieComponent = new MovieView(movie);
    this.#popupComponent = new PopupView(movie, comments);

    this.#bindMovieHandlers();
    this.#bindPopupHandlers();

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this.#movieComponent, this.#container.element);
      return;
    }

    if (this.#container.element.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    if (this.#bodyElement.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  };

  getMovieId = () => this.#movie?.id;

  #bindMovieHandlers = () => {
    this.#movieComponent.setOpenPopupClickHandler(this.#handleOpenPopup);
    this.#movieComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #bindPopupHandlers = () => {
    this.#popupComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #handleOpenPopup = () => {
    this.#bodyElement.classList.add('hide-overflow');
    this.#bodyElement.appendChild(this.#popupComponent.element);
    this.#bindPopupHandlers();
    document.addEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleClosePopup = () => {
    this.#bodyElement.classList.remove('hide-overflow');
    this.#bodyElement.removeChild(this.#popupComponent.element);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    remove(this.#popupComponent);
  };

  #handleEscKeyDown = (evt) => {
    evt.preventDefault();

    if (evt.key === 'Esc' || evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#handleEscKeyDown);
      this.#handleClosePopup();
    }
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

