import {render, RenderPosition} from './helpers/utils';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import Menu from "./view/menu";
import TripPresenter from './presenter/trip-presenter';
import StatsPresenter from './presenter/stats-presenter';
import HeaderPresenter from './presenter/header-presenter';
import {isOnline} from './helpers/utils';
import toast from "./helpers/toast/toast.js";

import API from './api/api';
import Store from './api/store';
import ApiProvider from './api/provider';
const URL = `https://13.ecmascript.pages.academy/big-trip`;


const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);
const tripStats = document.querySelector(`main .page-body__container`);

const api = new API(URL, `eo0w590ik298123`);
const store = new Store(`/points`, window.localStorage);
const apiWithProvider = new ApiProvider(api, store);
const pointsModel = new PointsModel(apiWithProvider);
const filterModel = new FilterModel();


const trip = new TripPresenter(tripSorting, pointsModel, filterModel);
const stats = new StatsPresenter(tripStats, pointsModel, filterModel);
const header = new HeaderPresenter(tripMain, pointsModel, filterModel);

Promise.all([
  apiWithProvider.getData(`/destinations`).then((dest) => pointsModel.setData(`destinations`, dest)).catch(() => pointsModel.setData(`destinations`, [])),
  apiWithProvider.getData(`/offers`).then((offers) => pointsModel.setData(`offers`, offers)).catch(() => pointsModel.setData(`offers`, [])),
  apiWithProvider.getPoints().then((points) => pointsModel.setPoints(points)).catch(() => pointsModel.setPoints([])),
]).then(() => {
  trip.init();
  stats.init();
  header.init();

  render(tripControls, new Menu(trip, stats), RenderPosition.AFTERBEGIN);
});


const addEventBtn = document.querySelector(`.trip-main__event-add-btn`);
addEventBtn.addEventListener(`click`, () => {
  if (!isOnline()) {
    toast(`You can't create new task offline`);
    return;
  }
  trip.initNewPoint();
});

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`);
// });

window.addEventListener(`online`, () => {
  toast(`You are online.`);
  if (apiWithProvider.needSync) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  toast(`You are offline. You can only add to favorite`);
});
