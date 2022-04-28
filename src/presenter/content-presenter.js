import MovieListView from '../view/movie-list-view.js';
import ContentView from '../view/content-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import MovieView from '../view/movie-view.js';
import MovieListExtraView from '../view/movie-list-extra-view.js';
import MovieContainerView from '../view/movie-container-view.js';
import SortingView from '../view/sorting-view.js';
import {render} from '../render.js';

const Titles = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};

const SHOW_MOVIES_COUNT = 5;
const SHOW_RATED_COUNT = 2;
const SHOW_COMMENTED_COUNT = 2;

export default class ContentPresenter {

  contentComponent = new ContentView();

  init(container) {
    render(new SortingView(), container);
    render(this.contentComponent, container);

    this.movieListComponent = new MovieListView();
    this.renderMovieList(this.movieListComponent, SHOW_MOVIES_COUNT);
    this.renderMovieList(new MovieListExtraView(Titles.RATED), SHOW_RATED_COUNT);
    this.renderMovieList(new MovieListExtraView(Titles.COMMENTED), SHOW_COMMENTED_COUNT);

    render(new LoadMoreButtonView(), this.movieListComponent.getElement());
  }

  renderMovieList(listContainer, count) {
    const movieContainer = new MovieContainerView();
    render(listContainer, this.contentComponent.getElement());
    render(movieContainer, listContainer.getElement());

    Array(count).fill('').forEach(() => {
      render(new MovieView(), movieContainer.getElement());
    });
  }
}


