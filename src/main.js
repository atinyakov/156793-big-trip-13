import {createListFilters} from "./view/listFilters";
import {createMenu} from "./view/menu";
import {createTripHeader} from "./view/tripHeader";
import {createSorting} from "./view/sorting";
import {createPoint} from "./view/point";
import {createPointEditor} from "./view/pointCreate";

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);

const render = (target, markup, position = `beforeend`) => {
  target.insertAdjacentHTML(position, markup);
};

render(tripMain, createTripHeader(), `afterbegin`);

render(tripControls, createListFilters());
render(tripControls, createMenu(), `afterbegin`);
render(tripSorting, createSorting(), `afterbegin`);

const pointList = document.createElement(`ul`);
pointList.classList.add(`trip-events__list`);

tripSorting.appendChild(pointList);

render(pointList, createPointEditor());

for (let index = 0; index < 3; index++) {
  render(pointList, createPoint());
}
