import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';
import {CheckType, UpdateType, UserAction} from '../constant.js';
import {hideScroll, showScroll} from '../utils/common.js';

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
  #isSaving = false;

  constructor(container, commentsModel, changeData) {
    this.#container = container;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  handleOpenPopup = async (movie) => {
    this.#movie = movie;
    const comments = await this.#commentsModel.init(movie.id);
    this.#renderPopup(movie, comments);
  };

  handleRefreshPopup = (updateMovie) => {
    if (this.#popupStatus === PopupStatus.OPEN) {
      this.#isSaving = false;
      this.#movie = updateMovie;
      this.#handleUpdatePopup(updateMovie, this.#commentsModel.comments);
    }
  };

  handleIsAborting = () => {
    if (this.#popupStatus === PopupStatus.OPEN) {
      this.#isSaving = false;
      this.#popupComponent.runShakeEffect(this.#handleResetPopup);
    }
  };

  #handleClosePopup = () => {
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#handlerEscKeyDown);
    document.removeEventListener('keydown', this.#handleSaveKeyDown);
    showScroll(this.#container);
    this.#popupStatus = PopupStatus.CLOSE;
  };

  #renderPopup = (movie, comments) => {
    if (this.#popupStatus !== PopupStatus.CLOSE) {
      this.#handleClosePopup();
    }

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(movie, comments);
    this.#popupComponent.setClosePopupClickHandler(this.#handleClosePopup);
    this.#popupComponent.setWatchListClickHandler(() => this.#handleWatchListClick(movie));
    this.#popupComponent.setWatchedClickHandler(() => this.#handleWatchedClick(movie));
    this.#popupComponent.setFavoriteClickHandler(() => this.#handleFavoriteClick(movie));
    this.#popupComponent.setRemoveClickHandler(this.#handleRemoveCommentClick);

    document.addEventListener('keydown', this.#handlerEscKeyDown);
    document.addEventListener('keydown', this.#handleSaveKeyDown);
    hideScroll(this.#container);

    render(this.#popupComponent, this.#container);
    remove(prevPopupComponent);

    this.#popupStatus = PopupStatus.OPEN;
  };

  #handlerEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#handlerEscKeyDown);
      this.#handleClosePopup();
    }
  };

  #handleWatchListClick = () => {
    this.#popupComponent.update({isChangingType: CheckType.WATCH_LIST});
    const newUserDetails = {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleWatchedClick = () => {
    this.#popupComponent.update({isChangingType: CheckType.WATCHED});
    const newUserDetails = {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleFavoriteClick = () => {
    this.#popupComponent.update({isChangingType: CheckType.FAVORITE});
    const newUserDetails = {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleSaveKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter' && !this.#isSaving) {
      this.#isSaving = true;
      this.#popupComponent.update({isSaving: true});
      const newComment = this.#popupComponent.getNewComment();

      if (!newComment.emotion || !newComment.comment) {
        this.handleIsAborting();
        return;
      }

      this.#changeData(UserAction.ADD_COMMENT, UpdateType.MAJOR, {newComment, movieId: this.#movie.id});
    }
  };

  #handleRemoveCommentClick = (commentId) => {
    this.#popupComponent.update({isDeletingComment: commentId});
    const updateMovie = {...this.#movie, comments: this.#movie.comments.filter((it) => it !== commentId)};
    this.#changeData(UserAction.REMOVE_COMMENT, UpdateType.MAJOR, {commentId, updateMovie});
  };

  #handleUpdatePopup = (movie, comments) => {
    this.#popupComponent.update({
      movie,
      movieComments: comments,
      isChangingType: null,
      isSaving: false,
      isDeletingComment: null,
      newComment: null,
      success: true,
    });
  };

  #handleResetPopup = () => {
    this.#popupComponent.update({
      isChangingType: null,
      isSaving: false,
      isDeletingComment: null,
    });
  };
}

