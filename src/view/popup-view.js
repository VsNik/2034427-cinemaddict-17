import dayjs from 'dayjs';
import {createElement} from '../render.js';
import {formattingDuration} from '../utils.js';

const createDetailsTemplate = (filmInfo) => {

  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release: {date, releaseCountry},
    runtime,
    genre,
    description
  } = filmInfo;

  const getGenres = (genreMovie) => genreMovie.map((it) =>
    `<span class="film-details__genre">${it}</span>`).join('');

  const writersString = writers.join(', ');
  const actorsString = actors.join(', ');
  const releaseDate = dayjs(date).format('D MMMM YYYY');
  const duration = formattingDuration(runtime);
  const genresTitle =  genre.length > 1 ? 'Genres' : 'Genre';
  const genres = getGenres(genre);

  return `
  <div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="">

      <p class="film-details__age">${ageRating} +</p>
    </div>
    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">${alternativeTitle}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${totalRating}</p>
        </div>
      </div>
      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writersString}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actorsString}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${releaseDate}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${duration}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${genresTitle}</td>
          <td class="film-details__cell">${genres}</tr>
      </table>
      <p class="film-details__film-description">${description}</p>
    </div>
  </div>`;
};

const createControlsTemplate = (userDetails) => {

  const {watchlist, alreadyWatched, favorite} = userDetails;

  return `
  <section class="film-details__controls">
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}"
      id="watchlist"
      name="watchlist"
    >
      Add to watchlist
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}"
      id="watched"
      name="watched"
    >
      Already watched
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}"
      id="favorite"
      name="favorite"
    >
      Add to favorites
    </button>
  </section>`;
};

const createCommentTemplate = ({emoji, text, author, date}) => {

  const commentDate = dayjs(date).format('YYYY/MM/DD');

  return `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

const createPopupTemplate = ({filmInfo, userDetails, comments}, movieComments) => {

  const commentsCount = comments.length;
  const commentsList = movieComments.map((it) => createCommentTemplate(it)).join('');

  return `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        ${createDetailsTemplate(filmInfo)}
        ${createControlsTemplate(userDetails)}
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView {

  constructor(movie, comments) {
    this.movie = movie;
    this.coments = comments;
  }

  getTemplate() {
    return createPopupTemplate(this.movie, this.coments);
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
