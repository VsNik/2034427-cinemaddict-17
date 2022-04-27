import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import PopupView from './view/popup-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import {render} from './render.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticElement = document.querySelector('.footer__statistics');

render(new ProfileView(), headerElement);
render(new MenuView(), mainElement);
render(new StatisticsView(), statisticElement);

const contentPresenter = new ContentPresenter();
contentPresenter.init(mainElement);

render(new PopupView(), document.body);
