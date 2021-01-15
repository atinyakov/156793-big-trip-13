
import Empty from "../view/empty";
import PointPresenter from './point-presenter';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import {SortType, UpdateType, Mode, FilterType} from '../mock/constants';

import {render, RenderPosition} from '../helpers/utils';
import Observers from '../helpers/observers';
import dayjs from "dayjs";

export default class TripPresenter {
  constructor(target, pointsModel, filterModel) {
    this._container = target;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointObserver = new Observers();
    this._empty = new Empty();
    this.resetPoints = this._resetPoints.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.subscribe(this._handleModelEvent);
  }

  init() {
    const tripControls = document.querySelector(`.trip-controls`);
    this._renderFilters(tripControls);
    this._renderSorting(this._container);
    this._renderTrip();
  }

  _renderEmpty() {
    render(this._container, this._empty, RenderPosition.BEFOREEND);
  }

  _renderSorting(target) {
    this._sorting = new SortPresenter(target, this._filterModel);
    this._sorting.init();

    this._sorting.setHandler(() => {
      this._clearTrip();
      this._renderTrip();
    });
  }

  initNewPoint() {
    if (this._newPoint !== undefined) {
      return;
    }

    this. _resetPoints();
    this._sorting.setCurrentValue(SortType.DAY);
    this._sorting.handleModelEvent();
    this._filterModel.setFilter(FilterType.EVERYTHING);
    this._filters.handleFilterChange();

    this._newPoint = new PointPresenter(this._newPointContainer, this._pointsModel, this.resetPoints, this._filterModel);
    this._newPoint.init({}, Mode.ADD);
    this._pointObserver.subscribe(this._newPoint);
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(container, this._pointsModel, this.resetPoints, this._filterModel);
    pointPresenter.init(point, Mode.DEFAULT);
    this._pointObserver.subscribe(pointPresenter);

  }

  _handleModelEvent(updateType, point) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointObserver.run((el) => {
          if (el.getPointData().id === point.id) {
            el.init(point);
          }
        });
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._resetPoints();
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _renderFilters(target) {
    this._filters = new FilterPresenter(target, this._pointsModel, this._filterModel);

    this._filters.init();
    this._filters.setFilterHandler(() => {
      this._sorting.setCurrentValue(SortType.DAY);

      this._clearTrip();
      this._renderTrip();
    });
  }

  _renderPoints(container) {
    this._points.forEach((point) => {
      this._renderPoint(container, point);
    });
  }

  _renderTrip() {
    this._points = this._pointsModel.getPoints(this._filterModel.getFilter());
    const filter = this._sorting.getCurrentValue();

    switch (filter) {
      case SortType.DAY:
        this._points = this._points.sort((a, b) => {
          return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? -1 : 1;
        });
        break;
      case SortType.TIME:
        this._points = this._points.sort((a, b) => {
          return dayjs(a.startTime).diff(a.endTime, `m`) - dayjs(b.startTime).diff(b.endTime, `m`) > 0 ? -1 : 1;
        });
        break;
      case SortType.PRICE:
        this._points = this._points.sort((a, b) => {
          return a.price - b.price < 0 ? -1 : 1;
        });
        break;
    }

    if (this._points === undefined || !this._points.length) {
      this._renderEmpty();
      return;
    }

    const pointList = document.createElement(`ul`);
    pointList.classList.add(`trip-events__list`);

    this._container.appendChild(pointList);
    this._newPointContainer = pointList;

    this._renderPoints(pointList);
  }

  _resetPoints() {
    this._pointObserver.run(`resetView`);
  }

  _clearTrip() {
    this._pointObserver.run((el) => {
      el.destroy();
    });

    this._newPoint = undefined;
    this._empty.getElement().remove();
    this._pointObserver.clear();
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
    this._renderTrip();
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
    this._sorting.setCurrentValue(SortType.DAY);
    this._sorting.handleModelEvent();
    this._clearTrip();
  }
}
