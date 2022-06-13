import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formattingDuration, getDateYear} from '../utils/date.js';
import {shake} from '../utils/shake-effect.js';
import {CheckType} from '../constant.js';

const MAX_DESCRIPTION_LENGTH = 140;

const createMovieTemplate = ({movie, isChangingType}) => {
  const {filmInfo, userDetails, comments} = movie;
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const createShortDescription = (fullDescription) =>
    fullDescription.length >= MAX_DESCRIPTION_LENGTH
      ? `${fullDescription.slice(0, MAX_DESCRIPTION_LENGTH - 1)} ...`
      : fullDescription;

  const releaseYear = getDateYear(release.date);
  const duration = formattingDuration(runtime);
  const shortDescription = createShortDescription(description);
  const commentsCount = comments.length;

  return `
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <span class="film-card__comments">${commentsCount} comments</span>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? 'film-card__controls-item--active' : ''}"
        type="button"
        style="background-color: ${isChangingType === CheckType.WATCH_LIST ? '#252626' : ''}"
        ${isChangingType ? 'disabled' : ''}
      >
        Add to watchlist
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}"
        type="button"
        style="background-color: ${isChangingType === CheckType.WATCHED ? '#252626' : ''}"
        ${isChangingType ? 'disabled' : ''}
      >
        Mark as watched
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}"
        type="button"
        style="background-color: ${isChangingType === CheckType.FAVORITE ? '#252626' : ''}"
        ${isChangingType ? 'disabled' : ''}
      >
        Mark as favorite
      </button>
    </div>
  </article>`;
};

export default class MovieView extends AbstractStatefulView {

  constructor(movie) {
    super();
    this._state = this.#parseMovieToState(movie);
  }

  #parseMovieToState = (movie) => ({
    movie,
    isChangingType: null
  });

  get template() {
    return createMovieTemplate(this._state);
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.clickOpenPopup = callback;
    this.element.addEventListener('click', this.#openPopupClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  runShake = () => {
    switch (this._state.isChangingType) {
      case CheckType.WATCH_LIST:
        shake(
          this.element.querySelector('.film-card__controls-item--add-to-watchlist'),
          this.#resetChanging
        );
        break;
      case CheckType.WATCHED:
        shake(
          this.element.querySelector('.film-card__controls-item--mark-as-watched'),
          this.#resetChanging
        );
        break;
      case CheckType.FAVORITE:
        shake(
          this.element.querySelector('.film-card__controls-item--favorite'),
          this.#resetChanging
        );
        break;
    }
  };

  _restoreHandlers =() => {
    this.setOpenPopupClickHandler(this._callback.clickOpenPopup);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  #resetChanging = () => (this.updateElement({...this._state, isChangingType: null}));

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      this._callback.clickOpenPopup();
    }
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({...this._state, isChangingType: CheckType.WATCH_LIST});
    this._callback.watchListClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({...this._state, isChangingType: CheckType.WATCHED});
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({...this._state, isChangingType: CheckType.FAVORITE});
    this._callback.favoriteClick();
  };
}

