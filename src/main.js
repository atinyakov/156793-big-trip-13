import {render, RenderPosition} from './helpers/utils';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import Menu from "./view/menu";
import Header from "./view/header";
import TripPresenter from './presenter/trip-presenter';
import API from './api';
const URL = `https://13.ecmascript.pages.academy/big-trip`;


const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);

const api = new API(URL, `eo0w590ik298123`);
const pointsModel = new PointsModel(api);


const filterModel = new FilterModel();
render(tripControls, new Menu(), RenderPosition.AFTERBEGIN);


const trip = new TripPresenter(tripSorting, pointsModel, filterModel);

Promise.all([
  api.getData(`/destinations`).then((dest) => pointsModel.setData(`destinations`, dest)).catch(() => pointsModel.setData(`destinations`, [])),
  api.getData(`/offers`).then((offers) => pointsModel.setData(`offers`, offers)).catch(() => pointsModel.setData(`offers`, [])),
  api.getPoints().then((points) => pointsModel.setPoints(points)).catch(() => pointsModel.setPoints([])),
]).then(() => {
  trip.init();
  render(tripMain, new Header(pointsModel, filterModel), RenderPosition.AFTERBEGIN);

});


const addEventBtn = document.querySelector(`.trip-main__event-add-btn`);
addEventBtn.addEventListener(`click`, () => {
  trip.initNewPoint();
});
