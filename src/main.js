import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import {render} from './render.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticElement = document.querySelector('.footer__statistics');

render(new ProfileView(), headerElement);
render(new MenuView(), mainElement);
render(new StatisticsView(), statisticElement);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const contentPresenter = new ContentPresenter(mainElement, moviesModel, commentsModel);

contentPresenter.init();


