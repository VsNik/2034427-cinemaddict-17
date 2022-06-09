import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formattingDuration, getRelativeDateFromNow, convertDateToString} from '../utils/date.js';
import {debounce, encodeText, sortByDateDesc} from '../utils/common.js';
import {shake} from '../utils/shake-effect';
import {CheckType} from '../constant.js';

const OFFSET_TOP = 80;

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

const createControlsTemplate = (userDetails, isChangingType, isSaving) => {

  const {watchlist, alreadyWatched, favorite} = userDetails;

  return `
  <section class="film-details__controls">
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}"
      id="watchlist"
      name="watchlist"
      ${isChangingType || isSaving ? 'disabled' : ''}
    >
        ${isChangingType === CheckType.WATCH_LIST ? 'Changing...' : 'Add to watchlist'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}"
      id="watched"
      name="watched"
      ${isChangingType || isSaving ? 'disabled' : ''}
    >
        ${isChangingType === CheckType.WATCHED ? 'Changing...' : 'Already watched'}
    </button>
    <button
      type="button"
      class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}"
      id="favorite"
      name="favorite"
      ${isChangingType || isSaving ? 'disabled' : ''}
    >
        ${isChangingType === CheckType.FAVORITE ? 'Changing...' : 'Add to favorites'}
    </button>
  </section>`;
};

const createCommentTemplate = ({id, emotion, comment, author, date}, isDeletingComment, isSaving) => {

  const commentDate = getRelativeDateFromNow(date);
  const encodedComment = encodeText(comment);

  return `
  <li class="film-details__comment" id="comment_${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${encodedComment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button
            class="film-details__comment-delete"
            ${isDeletingComment === id || isSaving ? 'disabled' : ''}
        >
            ${isDeletingComment === id ? 'Deleting...' : 'Delete'}
        </button>
      </p>
    </div>
    <input type="hidden" name="commentId" value="${id}" />
  </li>`;
};

const createPopupTemplate = ({movie, movieComments, newComment, isSaving, isDeletingComment, isChangingType}) => {
  const {filmInfo, userDetails, comments} = movie;
  const commentsCount = comments.length;

  const getCommentsList = (commentary) => {
    const sortedComments = sortByDateDesc([...commentary]);
    return sortedComments.map((it) => createCommentTemplate(it, isDeletingComment, isSaving)).join('');
  };

  const commentsList = getCommentsList(movieComments);

  const newEmoji = newComment?.emoji ? `
      <img src="images/emoji/${newComment.emoji}.png" width="55" height="55" alt="emoji-smile">
      <input type="hidden" name="emoji" value="${newComment.emoji}">
    ` : '';

  return `
  <section class="film-details" style="z-index: 10">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button" ${isSaving ? 'disabled' : ''}>close</button>
        </div>
        ${createDetailsTemplate(filmInfo)}
        ${createControlsTemplate(userDetails, isChangingType, isSaving)}
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label" style="background-color: ${isSaving ? 'gray' : ''}">
                ${newEmoji}
            </div>

            <label class="film-details__comment-label">
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
                ${isSaving ? 'disabled' : ''}
                style="background-color: ${isSaving ? 'gray' : ''}"
              ></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-smile"
                value="smile"
                ${isSaving ? 'disabled' : ''}
                ${newComment?.emoji === 'smile' ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-sleeping"
                value="sleeping"
                ${isSaving ? 'disabled' : ''}
                ${newComment?.emoji === 'sleeping' ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-puke"
                value="puke"
                ${isSaving ? 'disabled' : ''}
                ${newComment?.emoji === 'puke' ? 'checked' : ''}
              >
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-angry"
                value="angry"
                ${isSaving ? 'disabled' : ''}
                ${newComment?.emoji === 'angry' ? 'checked' : ''}
              >
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

  #positionTop = 0;

  constructor(movie, comments) {
    super();
    this._state = this.#parseMovieToState(movie, comments);
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

  update = (update) => {
    if (this._state.isSaving && update.success) {
      const commentsElementPositionTop = this.element.querySelector('.film-details__comments-list').offsetTop;
      this.#positionTop = commentsElementPositionTop - OFFSET_TOP;
    }
    delete update.success;
    this.updateElement(update);
  };

  runShakeEffect = (callback) => {
    let element;
    if (this._state.isDeletingComment) {
      element = this.element.querySelector(`#comment_${this._state.isDeletingComment}`);
    }
    if (this._state.isChangingType) {
      element = this.#getCheckElement(this._state.isChangingType);
    }
    if (this._state.isSaving) {
      element = this.element.querySelector('form');
    }
    shake(element, callback);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setRemoveClickHandler(this._callback.removeCommentClick);

    this.element.scrollTop = this.#positionTop;

    if (this._state.newComment?.comment) {
      this.element.querySelector('.film-details__comment-input')
        .value = this._state.newComment.comment;
    }
  };

  #getCheckElement = (checkType) => {
    switch (checkType) {
      case CheckType.WATCH_LIST:
        return this.element.querySelector('.film-details__controls #watchlist');
      case CheckType.WATCHED:
        return this.element.querySelector('.film-details__controls #watched');
      case CheckType.FAVORITE:
        return this.element.querySelector('.film-details__controls #favorite');
      default:
        return null;
    }
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

    this._setState({
      ...this._state, newComment: {...this._state.newComment, comment: evt.target.value}
    });
  };

  #changeEmojiHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      ...this._state, newComment: {...this._state.newComment, emoji: evt.target.value}
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
    positionTop,
    isChangingType: null,
    isSaving: false,
    isDeletingComment: null,
  });

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', (evt) => {
        if (evt.target.tagName === 'INPUT') {
          this.#changeEmojiHandler(evt);
        }
      });

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', (evt) => this.#inputCommentHandler(evt));

    this.element.addEventListener('scroll', debounce(() => (this.#positionTop = this.element.scrollTop), 500));
  };
}
