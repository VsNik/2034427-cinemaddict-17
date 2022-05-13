import MovieView from '../view/movie-view.js';
import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';

export default class MoviePresenter {

  #bodyElement;
  #container;
  #movie = null;
  #movieComponent;
  #popupComponent;

  constructor(bodyElement, container) {
    this.#bodyElement = bodyElement;
    this.#container = container;
  }

  init = (movie, comments) => {
    this.#movie = movie;
    this.#movieComponent = new MovieView(movie);
    this.#popupComponent = new PopupView(movie, comments);

    this.#movieComponent.handleOpenPopupClick(this.#handleOpenPopup);
    render(this.#movieComponent, this.#container.element);
  };

  #handleOpenPopup = () => {
    this.#bodyElement.classList.add('hide-overflow');
    this.#bodyElement.appendChild(this.#popupComponent.element);

    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#popupComponent.handleClosePopupClick(this.#handleClosePopup);
  };

  #handleClosePopup = () => {
    this.#bodyElement.classList.remove('hide-overflow');
    this.#bodyElement.removeChild(this.#popupComponent.element);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    remove(this.#popupComponent);
  };

  #handleEscKeyDown = (evt) => {
    evt.preventDefault();

    if (evt.key === 'Esc' || evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#handleEscKeyDown);
      this.#handleClosePopup();
    }
  };
}
