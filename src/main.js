import dayjs from "dayjs";

import {render, RenderPosition} from './helpers/utils';

import Filters from "./view/filters";
import Menu from "./view/menu";
import Header from "./view/header";
import Sorting from "./view/sorting";
import Point from "./view/point";
import Editor from "./view/editor";
import {createPointData} from "./mock/point";

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripSorting = document.querySelector(`.trip-events`);


const points = Array(20)
  .fill()
  .map(() => createPointData())
  .sort((a, b)=> {
    return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? 1 : -1;
  });

render(tripMain, new Header(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new Filters().getElement(), RenderPosition.BEFOREEND);
render(tripControls, new Menu().getElement(), RenderPosition.AFTERBEGIN);
render(tripSorting, new Sorting().getElement(), RenderPosition.AFTERBEGIN);

const pointList = document.createElement(`ul`);
pointList.classList.add(`trip-events__list`);
tripSorting.appendChild(pointList);

points.forEach((point, index) => {
  const pointElem = new Point(point);
  const editorElem = new Editor(point, index, `edit`);

  pointElem.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    pointList.replaceChild(editorElem.getElement(), pointElem.getElement());
  });

  editorElem.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    pointList.replaceChild(pointElem.getElement(), editorElem.getElement());
  });

  editorElem.getElement().querySelector(`form`).addEventListener(`submit`, (e) => {
    e.preventDefault();

    // console.log(`SAVE`);
    pointList.replaceChild(pointElem.getElement(), editorElem.getElement());
  });

  editorElem.getElement().querySelector(`form`).addEventListener(`reset`, (e) => {
    e.preventDefault();

    // console.log(`DELETE`);
    pointList.replaceChild(pointElem.getElement(), editorElem.getElement());

  });

  render(pointList, pointElem.getElement(), RenderPosition.BEFOREEND);
});
