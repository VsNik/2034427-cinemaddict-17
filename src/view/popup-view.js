import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formattingDuration, getRelativeDateFromNow, convertDateToString} from '../utils/date.js';
import he from 'he';

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
  const releaseDate = convertDateToString(date);
  const duration = formattingDuration(runtime);
  const genresTitle = genre.length > 1 ? 'Genres' : 'Genre';
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

const createCommentTemplate = ({id, emotion, comment, author, date}) => {

  const commentDate = getRelativeDateFromNow(date);

  return `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
    <input type="hidden" name="commentId" value="${id}" />
  </li>`;
};

const createPopupTemplate = ({movie, movieComments, newComment}) => {
  const {filmInfo, userDetails, comments} = movie;
  const commentsCount = comments.length;
  const commentsList = movieComments.map((it) => createCommentTemplate(it)).join('');

  const newEmoji = newComment?.emoji ? `
      <img src="images/emoji/${newComment.emoji}.png" width="55" height="55" alt="emoji-smile">
      <input type="hidden" name="emoji" value="${newComment.emoji}">
    ` : '';

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
            <div class="film-details__add-emoji-label">
                ${newEmoji}
            </div>

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

export default class PopupView extends AbstractStatefulView {

  #newComment = null;
  #positionTop = 0;

  constructor(movie, comments) {
    super();
    this._state = this.#parseMovieToState(movie, comments, this.#newComment);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closePopupClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  setRemoveClickHandler = (callback) => {
    this._callback.removeCommentClick = callback;
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#removeCommentClickHandler);
  };

  getNewComment = () => this.#parseStateToComment(this._state);

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

    this.element.scrollTop = this.#positionTop;
  };

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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

  #removeCommentClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'BUTTON') {
      const commentId = evt.target.closest('.film-details__comment')
        .querySelector('input[type="hidden"]').value;
      this._callback.removeCommentClick(commentId);
    }
  };

  #inputCommentHandler = (evt) => {
    evt.preventDefault();
    this._setState({...this._state, newComment: {...this._state.newComment, comment: evt.target.value}});
  };

  #changeEmojiHandler = (evt) => {
    evt.preventDefault();

    this.#positionTop = this.element.scrollTop;
    this.updateElement({
      ...this._state, newComment: {...this.#newComment, emoji: evt.target.value}
    });
  };

  #parseStateToComment = (state) => {
    const comment = {...state.newComment};

    const newComment = {
      ...comment,
      emotion: comment.emoji
    };
    delete newComment.emoji;
    return newComment;
  };

  #parseMovieToState = (movie, comments, newComment, positionTop) => ({
    movie,
    movieComments: comments,
    newComment,
    positionTop
  });

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', (evt) => {
        if (evt.target.tagName === 'INPUT') {
          this.#changeEmojiHandler(evt);
        }
      });

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#inputCommentHandler);
  };
}
