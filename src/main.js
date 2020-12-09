import {render, RenderPosition} from './helpers/utils';

import Filters from "./view/filters";
import Menu from "./view/menu";
import Header from "./view/header";

import {points} from "./mock/point";

import TripPresenter from './presenter/tripPresenter';

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);


render(tripMain, new Header(points), RenderPosition.AFTERBEGIN);
render(tripControls, new Filters(), RenderPosition.BEFOREEND);
render(tripControls, new Menu(), RenderPosition.AFTERBEGIN);


const trip = new TripPresenter(tripSorting);
trip.init(points);
