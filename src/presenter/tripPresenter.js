
import Empty from "../view/empty";
import Sorting from "../view/sorting";
import PointPresenter from './pointPresenter';

import {render, RenderPosition} from '../helpers/utils';


export default class TripPresenter {
  constructor(target) {
    this._container = target;
    this._empty = new Empty();
    this._sorting = new Sorting();
  }

  init(points) {
    this._points = points;

    this._renderTrip();
  }

  _renderEmpty() {
    render(this._container, this._empty, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    render(this._container, this._sorting, RenderPosition.AFTERBEGIN);
  }


  _renderPoint(container, data, index) {
    const point = new PointPresenter(container);
    point.init(data, index);
  }

  _renderPoints() {
    const pointList = document.createElement(`ul`);
    pointList.classList.add(`trip-events__list`);
    this._container.appendChild(pointList);

    this._points.forEach((point, index) => {
      this._renderPoint(pointList, point, index);
    });
  }

  _renderTrip() {
    if (this._points === undefined || !this._points.length) {
      this._renderEmpty();
      return;
    }

    this._renderSorting();

    this._renderPoints();
  }

}
