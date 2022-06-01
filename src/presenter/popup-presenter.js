import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';
import {UpdateType, UserAction} from '../constant.js';
import {nanoid} from 'nanoid';

const PopupStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class PopupPresenter {

  #container;
  #movie = null;
  #commentsModel;
  #popupComponent = null;
  #popupStatus = PopupStatus.CLOSE;
  #changeData;

  constructor(container, commentsModel, changeData) {
    this.#container = container;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  handleOpenPopup = (movie) => {
    if (this.#popupStatus !== PopupStatus.CLOSE) {
      this.#handleClosePopup();
    }

    this.#movie = movie;
    const prevPopupComponent = this.#popupComponent;
    const comments = this.#commentsModel.getCommentsByIds(this.#movie.comments);
    this.#popupComponent = new PopupView(this.#movie, comments);

    this.#popupComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#popupComponent.setWatchListClickHandler(() => this.#handleWatchListClick(movie));
    this.#popupComponent.setWatchedClickHandler(() => this.#handleWatchedClick(movie));
    this.#popupComponent.setFavoriteClickHandler(() => this.#handleFavoriteClick(movie));
    this.#popupComponent.setRemoveClickHandler(this.#handleRemoveCommentClick);

    document.addEventListener('keydown', this.#handlerEscKeyDown);
    document.addEventListener('keydown', this.#handleCtrlEnterKeyDown);
    this.#container.classList.add('hide-overflow');

    render(this.#popupComponent, this.#container);
    remove(prevPopupComponent);

    this.#popupStatus = PopupStatus.OPEN;
  };

  handleRefreshPopup = (updateMovie) => {
    if (this.#popupStatus === PopupStatus.OPEN) {
      this.#popupStatus = PopupStatus.CLOSE;
      this.handleOpenPopup(updateMovie);
    }
  };

  #handleClosePopup = () => {
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#handlerEscKeyDown);
    document.removeEventListener('keydown', this.#handleCtrlEnterKeyDown);
    this.#container.classList.remove('hide-overflow');
    this.#popupStatus = PopupStatus.CLOSE;
  };

  #handlerEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#handlerEscKeyDown);
      this.#handleClosePopup();
    }
  };

  #handleWatchListClick = () => {
    const newUserDetails = {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleWatchedClick = () => {
    const newUserDetails = {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleFavoriteClick = () => {
    const newUserDetails = {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleCtrlEnterKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      const newComment = this.#popupComponent.getNewComment();
      // Temp data
      newComment.id = nanoid();
      newComment.author = 'Jaims Bond';
      newComment.date = new Date().toISOString();

      const updateMovie = {...this.#movie, comments: [...this.#movie.comments, newComment.id]};
      this.#changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, newComment);
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updateMovie);
    }
  };

  #handleRemoveCommentClick = (commentId) => {
    const updateMovie = {...this.#movie, comments: this.#movie.comments.filter((it) => it !== commentId)};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, updateMovie);
    this.#changeData(UserAction.REMOVE_COMMENT, UpdateType.MINOR, commentId);
  };
}

