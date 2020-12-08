import dayjs from "dayjs";

import {render, RenderPosition} from './helpers/utils';

import Filters from "./view/filters";
import Menu from "./view/menu";
import Header from "./view/header";

import {createPointData} from "./mock/point";

import TripPresenter from './presenter/tripPresenter';

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);


const points = Array(20)
  .fill()
  .map(() => createPointData())
  .sort((a, b) => {
    return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? 1 : -1;
  });

render(tripMain, new Header(points), RenderPosition.AFTERBEGIN);
render(tripControls, new Filters(), RenderPosition.BEFOREEND);
render(tripControls, new Menu(), RenderPosition.AFTERBEGIN);


const trip = new TripPresenter(tripSorting);
trip.init(points);
