import dayjs from "dayjs";

import {render, RenderPosition} from './helpers/utils';

import Filters from "./view/filters";
import Menu from "./view/menu";
import Empty from "./view/empty";
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


if (points.length > 0) {
  const pointList = document.createElement(`ul`);
  pointList.classList.add(`trip-events__list`);
  tripSorting.appendChild(pointList);
  render(tripSorting, new Sorting().getElement(), RenderPosition.AFTERBEGIN);

  points.forEach((point, index) => {
    const pointElem = new Point(point);
    const editorElem = new Editor(point, index, `edit`);

    const closeEditor = (e) => {
      e.preventDefault();
      if (e.key === `Escape` || e.key === `Esc`) {
        pointList.replaceChild(pointElem.getElement(), editorElem.getElement());
        document.removeEventListener(`keydown`, closeEditor);
      }
    };

    pointElem.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      pointList.replaceChild(editorElem.getElement(), pointElem.getElement());
      document.addEventListener(`keydown`, closeEditor);
    });

    editorElem.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      closeEditor();
    });

    editorElem.getElement().querySelector(`form`).addEventListener(`submit`, (e) => {
      e.preventDefault();

      // console.log(`SAVE`);
      closeEditor();
    });


    editorElem.getElement().querySelector(`form`).addEventListener(`reset`, (e) => {
      e.preventDefault();

      // console.log(`DELETE`);
      closeEditor();

    });

    render(pointList, pointElem.getElement(), RenderPosition.BEFOREEND);
  });
} else {
  render(tripSorting, new Empty().getElement(), RenderPosition.BEFOREEND);
}
