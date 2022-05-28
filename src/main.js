import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import {createFilters} from './mock/filter-mock.js';
import {getUserRang} from './utils/user-rang.js';
import {render} from './framework/render.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticElement = document.querySelector('.footer__statistics');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const movies = moviesModel.movies;
const filters = createFilters(movies);
const userRating = getUserRang(movies);
const moviesCount = movies.length;

render(new ProfileView(userRating), headerElement);
render(new MenuView(filters), mainElement);
render(new StatisticsView(moviesCount), statisticElement);

const contentPresenter = new ContentPresenter(mainElement, moviesModel, commentsModel);
const popupPresenter = new PopupPresenter(document.body, commentsModel, contentPresenter.handleViewAction);

contentPresenter.init(popupPresenter.handleOpenPopup, popupPresenter.handleRefreshPopup);


