import MovieListView from '../view/movie-list-view.js';
import ContentView from '../view/content-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import MovieView from '../view/movie-view.js';
import MovieListExtraView from '../view/movie-list-extra-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import SortingView from '../view/sorting-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

const SHOW_MOVIES_COUNT = 5;
const SHOW_RATED_COUNT = 2;
const SHOW_COMMENTED_COUNT = 2;

export default class ContentPresenter {

  #bodyElement;
  #container;
  #movies;
  #moviesModel;
  #commentsModel;
  #contentComponent = new ContentView();
  #movieListComponent = new MovieListView();

  init(container, moviesModel, commentsModel) {
    this.#bodyElement = container.parentNode;
    this.#container = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#movies = this.#moviesModel.movies;

    render(new SortingView(), container);
    render(this.#contentComponent, container);

    this.#renderMovieList(this.#movieListComponent, this.#movies, SHOW_MOVIES_COUNT);
    this.#renderMovieList(new MovieListExtraView(Titles.RATED), this.#movies, SHOW_RATED_COUNT);
    this.#renderMovieList(new MovieListExtraView(Titles.COMMENTED), this.#movies, SHOW_COMMENTED_COUNT);

    render(new LoadMoreButtonView(), this.#movieListComponent.element);
  }

  #renderMovieList(listContainer, movies, count) {
    const movieContainer = new MovieContainerView();
    render(listContainer, this.#contentComponent.element);
    render(movieContainer, listContainer.element);

    movies.slice(0, count).forEach((it) => {
      this.#renderMovie(movieContainer, it);
    });
  }

  #renderMovie(movieContainer, movie) {
    const movieComments = this.#commentsModel.getCommentsByIds(movie.comments);
    const movieComponent = new MovieView(movie);
    const popupComponent = new PopupView(movie, movieComments);

    const onClosePopup = () => {
      this.#bodyElement.classList.remove('hide-overflow');
      this.#bodyElement.removeChild(popupComponent.element);
      popupComponent.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        document.removeEventListener('keydown', onEscKeyDown);
        onClosePopup();
      }
    };

    const onOpenPopup = () => {
      this.#bodyElement.classList.add('hide-overflow');
      this.#bodyElement.appendChild(popupComponent.element);
      document.addEventListener('keydown', onEscKeyDown);
      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        document.removeEventListener('keydown', onEscKeyDown);
        onClosePopup();
      });
    };

    movieComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== 'BUTTON') {
        onOpenPopup();
      }
    });

    render(movieComponent, movieContainer.element);
  }
}

