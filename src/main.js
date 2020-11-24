import dayjs from "dayjs";

import {createListFilters} from "./view/listFilters";
import {createMenu} from "./view/menu";
import {createTripHeader} from "./view/tripHeader";
import {createSorting} from "./view/sorting";
import {createPoint} from "./view/point";
import {createPointEditor} from "./view/pointEdit";
import {createPointData} from "./mock/point";

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);

const render = (target, markup, position = `beforeend`) => {
  target.insertAdjacentHTML(position, markup);
};

const points = Array(20)
  .fill()
  .map(() => createPointData())
  .sort((a, b)=> {
    return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? 1 : -1;
  });

const [edit, ...restPoints] = points;
render(tripMain, createTripHeader(points), `afterbegin`);

render(tripControls, createListFilters());
render(tripControls, createMenu(), `afterbegin`);
render(tripSorting, createSorting(), `afterbegin`);

const pointList = document.createElement(`ul`);
pointList.classList.add(`trip-events__list`);

tripSorting.appendChild(pointList);

render(pointList, createPointEditor(edit, 1, `add`));

restPoints.forEach((point) => render(pointList, createPoint(point)));
