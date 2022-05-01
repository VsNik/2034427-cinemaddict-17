import dayjs from 'dayjs';
import {createElement} from '../render.js';
import {formattingDuration} from '../utils.js';

const MAX_DESCRIPTION_LENGTH = 140;

const createMovieTemplate = ({filmInfo, userDetails, comments}) => {

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

export default class MovieView {

  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createMovieTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
