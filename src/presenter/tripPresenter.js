
import Empty from "../view/empty";
import Sorting from "../view/sorting";
import PointPresenter from './pointPresenter';

import {render, RenderPosition, updateItem} from '../helpers/utils';

// const Mode = {
//   DEFAULT: `DEFAULT`,
//   EDITING: `EDITING`
// };

export default class TripPresenter {
  constructor(target) {
    this._container = target;
    this._pointList = {};
    this._empty = new Empty();
    this._sorting = new Sorting();

    this.updatePoint = this._updatePoint.bind(this);
    this.resetPoints = this._resetPoints.bind(this);
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
    this._pointList[update.id].init(update, index);
  }

  _renderPoint(container, point, index) {
    const pointPresenter = new PointPresenter(container, this.updatePoint, this.resetPoints);
    pointPresenter.init(point, index);
    this._pointList[point.id] = pointPresenter;
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

  _resetPoints() {
    Object.values(this._pointList).forEach((pointPreseter) => {
      pointPreseter.resetView();
    });
  }

}
