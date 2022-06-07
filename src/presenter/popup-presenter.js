import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';
import {UpdateType, UserAction} from '../constant.js';
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
      this.#movie = updateMovie;
      const comments = this.#commentsModel.comments;
      this.#popupStatus = PopupStatus.CLOSE;
      this.#renderPopup(updateMovie, comments);
    }
  };

  handleIsAborting = () => {
    if (this.#popupStatus === PopupStatus.OPEN) {
      this.#popupComponent.runShakeEffect(() => {
        this.#popupComponent.updateElement({
          isDisabled: false,
          isChanging: false,
          isSaving: false,
          isDeletingComment: null,
        });
      });
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
    this.#isChanging();
    const newUserDetails = {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleWatchedClick = () => {
    this.#isChanging();
    const newUserDetails = {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleFavoriteClick = () => {
    this.#isChanging();
    const newUserDetails = {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite};
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails: newUserDetails});
  };

  #handleSaveKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      this.#isCSaving();
      const newComment = this.#popupComponent.getNewComment();
      this.#changeData(UserAction.ADD_COMMENT, UpdateType.MAJOR, {newComment, movieId: this.#movie.id});
    }
  };

  #handleRemoveCommentClick = (commentId) => {
    this.#isDeleting(commentId);
    const updateMovie = {...this.#movie, comments: this.#movie.comments.filter((it) => it !== commentId)};
    this.#changeData(UserAction.REMOVE_COMMENT, UpdateType.MAJOR, {commentId, updateMovie});
  };

  #isChanging = () => (
    this.#popupComponent.updateElement({
      isDisabled: true,
      isChanging: true,
    }));

  #isCSaving = () => (
    this.#popupComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    }));

  #isDeleting = (commentId) => (
    this.#popupComponent.updateElement({
      isDisabled: true,
      isDeletingComment: commentId,
    }));
}

