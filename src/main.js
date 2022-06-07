import StatisticsView from './view/statistics-view.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ContentPresenter from './presenter/content-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import MovieApiService from './service/movie-api-service.js';
import CommentApiService from './service/comment-api-service.js';
import {render} from './framework/render.js';

const AUTHORIZATION = 'Basic 6fqQTu05ocjBJBBn';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticElement = document.querySelector('.footer__statistics');

const movieApiService = new MovieApiService(END_POINT, AUTHORIZATION);
const commentApiService = new CommentApiService(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel(movieApiService);
const commentsModel = new CommentsModel(commentApiService, moviesModel.handleChangeData);
const filterModel = new FilterModel();

const profilePresenter = new ProfilePresenter(headerElement, moviesModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
const contentPresenter = new ContentPresenter(mainElement, moviesModel, commentsModel, filterModel);
const popupPresenter = new PopupPresenter(document.body, commentsModel, contentPresenter.handleViewAction);

moviesModel.init()
  .finally(() =>
    render(new StatisticsView(moviesModel.movies.length), statisticElement)
  );

profilePresenter.init();
filterPresenter.init();
contentPresenter.init(
  popupPresenter.handleOpenPopup,
  popupPresenter.handleRefreshPopup,
  popupPresenter.handleIsAborting
);

