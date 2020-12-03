import dayjs from "dayjs";

import {render, RenderPosition, replace} from './helpers/utils';

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
  .sort((a, b) => {
    return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? 1 : -1;
  });

render(tripMain, new Header(points), RenderPosition.AFTERBEGIN);
render(tripControls, new Filters(), RenderPosition.BEFOREEND);
render(tripControls, new Menu(), RenderPosition.AFTERBEGIN);


if (points.length > 0) {
  const pointList = document.createElement(`ul`);
  pointList.classList.add(`trip-events__list`);
  tripSorting.appendChild(pointList);
  render(tripSorting, new Sorting(), RenderPosition.AFTERBEGIN);

  points.forEach((point, index) => {
    const pointElem = new Point(point);
    const editorElem = new Editor(point, index, `edit`);

    const closeEditor = () => {
      replace(pointList, pointElem, editorElem);
      document.removeEventListener(`keydown`, closeEditorByEsc);
    };
    const closeEditorByEsc = (e) => {
      if (e.key === `Escape` || e.key === `Esc`) {
        closeEditor();
      }
    };

    pointElem.setClickHandler(() => {
      replace(pointList, editorElem, pointElem);

      document.addEventListener(`keydown`, closeEditorByEsc);
    });

    editorElem.setClickHandler(closeEditor);
    editorElem.setSubmitHandler(closeEditor);
    editorElem.setResetHandler(closeEditor);

    render(pointList, pointElem, RenderPosition.BEFOREEND);
  });
} else {
  render(tripSorting, new Empty(), RenderPosition.BEFOREEND);
}
