import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';
import {UpdateType, UserAction} from '../constant.js';

const PopupStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class PopupPresenter {

  #container;
  #commentsModel;
  #popupComponent = null;
  #popupStatus = PopupStatus.CLOSE;
  #movie = null;
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

    document.addEventListener('keydown', this.#handlerEscKeyDown);
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
}

