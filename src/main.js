import StatisticsView from './view/statistics-view.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ContentPresenter from './presenter/content-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import {render} from './framework/render.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticElement = document.querySelector('.footer__statistics');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

render(new StatisticsView(moviesModel.movies.length), statisticElement);

const profilePresenter = new ProfilePresenter(headerElement, moviesModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
const contentPresenter = new ContentPresenter(mainElement, moviesModel, commentsModel, filterModel);
const popupPresenter = new PopupPresenter(document.body, commentsModel, contentPresenter.handleViewAction);

profilePresenter.init();
filterPresenter.init();
contentPresenter.init(popupPresenter.handleOpenPopup, popupPresenter.handleRefreshPopup);

