import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import {formattingDuration} from '../utils.js';

const MAX_DESCRIPTION_LENGTH = 140;

const createMovieTemplate = (movie) => {
  const {filmInfo, userDetails, comments} = movie;
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const createShortDescription = (fullDescription) =>
    fullDescription.length >= MAX_DESCRIPTION_LENGTH
      ? `${fullDescription.slice(0, MAX_DESCRIPTION_LENGTH - 1)} ...`
      : fullDescription;

  const releaseYear = dayjs(release.date).format('YYYY');
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
      >
        Add to watchlist
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}"
        type="button"
      >
        Mark as watched
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}"
        type="button"
      >
        Mark as favorite
      </button>
    </div>
  </article>`;
};

export default class MovieView extends AbstractView {

  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieTemplate(this.#movie);
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.click = callback;

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

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== 'BUTTON') {
      this._callback.click();
    }
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}

