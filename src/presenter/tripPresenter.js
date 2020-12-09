
import Empty from "../view/empty";
import Sorting from "../view/sorting";
import PointPresenter from './pointPresenter';

import {render, RenderPosition, updateItem} from '../helpers/utils';


export default class TripPresenter {
  constructor(target) {
    this._container = target;
    this._pointList = {};
    this._empty = new Empty();
    this._sorting = new Sorting();

    this._updatePoint = this._updatePoint.bind(this);
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


  _updatePoint(update, index) {
    updateItem(this._points, update);
    // console.log(`here`);
    this._pointList[update.id].init(update, index);
  }

  _renderPoint(container, data, index) {
    const point = new PointPresenter(container, this._updatePoint);
    point.init(data, index);
    this._pointList[data.id] = point;
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
