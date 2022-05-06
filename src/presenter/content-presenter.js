import MovieListView from '../view/movie-list-view.js';
import ContentView from '../view/content-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import MovieView from '../view/movie-view.js';
import MovieListExtraView from '../view/movie-list-extra-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import SortingView from '../view/sorting-view.js';
import PopupView from '../view/popup-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import {render} from '../render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

const EmptyContentMessage = {
  MOVIES: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

const SHOW_MOVIES_COUNT = 5;

export default class ContentPresenter {

  #container;
  #movies = [];
  #moviesModel;
  #commentsModel;
  #contentComponent = new ContentView();
  #movieListComponent = new MovieListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #movieContainerComponent = new MovieContainerView();
  #renderedMovieCount = SHOW_MOVIES_COUNT;

  constructor(container, moviesModel, commentsModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#movies = this.#moviesModel.movies.slice();
    this.#renderContent();
  };

  #onLoadMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + SHOW_MOVIES_COUNT)
      .forEach((it) => {
        this.#renderMovie(this.#movieContainerComponent, it);
      });

    this.#renderedMovieCount += SHOW_MOVIES_COUNT;

    if (this.#renderedMovieCount >= this.#movies.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderMovie = (movieContainer, movie) => {
    const bodyElement = this.#container.parentNode;
    const movieComments = this.#commentsModel.getCommentsByIds(movie.comments);
    const movieComponent = new MovieView(movie);
    const popupComponent = new PopupView(movie, movieComments);

    const onClosePopup = () => {
      bodyElement.classList.remove('hide-overflow');
      bodyElement.removeChild(popupComponent.element);
      popupComponent.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        document.removeEventListener('keydown', onEscKeyDown);
        onClosePopup();
      }
    };

    const onOpenPopup = () => {
      bodyElement.classList.add('hide-overflow');
      bodyElement.appendChild(popupComponent.element);
      document.addEventListener('keydown', onEscKeyDown);

      popupComponent.handleClosePopupClick(() => {
        document.removeEventListener('keydown', onEscKeyDown);
        onClosePopup();
      });
    };

    movieComponent.handleOpenPopupClick(onOpenPopup);

    render(movieComponent, movieContainer.element);
  };

  #renderExtraMovieList = (listContainer, movies) => {
    if (movies.length) {
      const movieContainer = new MovieContainerView();
      render(listContainer, this.#contentComponent.element);
      render(movieContainer, listContainer.element);

      movies.forEach((it) => {
        this.#renderMovie(movieContainer, it);
      });
    }
  };

  #renderContent = () => {
    if (!this.#movies.length) {
      const noMoviesComponent = new NoMoviesView(EmptyContentMessage.MOVIES);
      render(noMoviesComponent, this.#container);
      return;
    }

    render(new SortingView(), this.#container);
    render(this.#contentComponent, this.#container);
    render(this.#movieListComponent, this.#contentComponent.element);
    render(this.#movieContainerComponent, this.#movieListComponent.element);

    this.#movies.slice(0, Math.min(this.#movies.length, SHOW_MOVIES_COUNT)).forEach((it) => {
      this.#renderMovie(this.#movieContainerComponent, it);
    });

    if (this.#movies.length > SHOW_MOVIES_COUNT) {
      render(this.#loadMoreButtonComponent, this.#movieListComponent.element);
      this.#loadMoreButtonComponent.handleShowMoreClick(this.#onLoadMoreButtonClick);
    }

    this.#renderExtraMovieList(new MovieListExtraView(Titles.RATED), this.#moviesModel.topRating);
    this.#renderExtraMovieList(new MovieListExtraView(Titles.COMMENTED), this.#moviesModel.topCommentsCount);
  };
}

