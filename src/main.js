import {render, RenderPosition} from './helpers/utils';
import PointsModel from './model/pointsModel';
import FilterModel from './model/filterModel';
import Menu from "./view/menu";
import Header from "./view/header";
import TripPresenter from './presenter/tripPresenter';
import {points} from "./mock/point";
import {nanoid} from 'nanoid';


const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();
render(tripMain, new Header(pointsModel, filterModel), RenderPosition.AFTERBEGIN);
render(tripControls, new Menu(), RenderPosition.AFTERBEGIN);


const trip = new TripPresenter(tripSorting, pointsModel, filterModel);
trip.init();

const addEventBtn = document.querySelector(`.trip-main__event-add-btn`);
addEventBtn.addEventListener(`click`, () => {
  pointsModel.addPoint({id: nanoid(10)});
});
