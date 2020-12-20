
import Empty from "../view/empty";
import Sorting from "../view/sorting";
import PointPresenter from './pointPresenter';
import FilterPresenter from './filterPresenter';

import {SORT_TYPE, UPDATE_TYPE} from '../mock/constants';

import {render, RenderPosition} from '../helpers/utils';
import Observers from '../helpers/observers';

export default class TripPresenter {
  constructor(target, pointsModel, filterModel) {
    this._container = target;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointObserver = new Observers();
    this._empty = new Empty();
    this._currentSortType = SORT_TYPE.DAY;
    this.resetPoints = this._resetPoints.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.subscribe(this._handleModelEvent);
  }

  init() {
    const tripControls = document.querySelector(`.trip-controls`);
    this._renderFilters(tripControls);
    this._renderSorting();

    this._renderTrip();
  }

  _renderEmpty() {
    render(this._container, this._empty, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    // console.log(this._sorting.getElement().querySelector(`.trip-events__trip-sort`));
    this._sorting = new Sorting();

    render(this._container, this._sorting, RenderPosition.AFTERBEGIN);
  }

  // _updatePoint(update) {
  //   this._points = this._pointsModel.updatePoint(update);

  // this._pointObserver.run((el) => {
  //   if (el.getPointData().id === update.id) {
  //     el.init(update);
  //   }
  // });
  // }

  _renderPoint(container, point) {
    // const pointPresenter = new PointPresenter(container, this._updatePoint, this.resetPoints);
    const pointPresenter = new PointPresenter(container, this._pointsModel, this.resetPoints);
    pointPresenter.init(point);
    this._pointObserver.subscribe(pointPresenter);

  }

  _handleModelEvent(updateType, point) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointObserver.run((el) => {
          if (el.getPointData().id === point.id) {
            el.init(point);
          }
        });
        break;
      // case UPDATE_TYPE.MINOR:
        // - обновить список (например, когда задача ушла в архив)
      //   this._clearBoard();
      //   this._renderBoard();
      //   break;
      case UPDATE_TYPE.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        // this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _renderFilters(target) {
    const filters = new FilterPresenter(target, this._pointsModel, this._filterModel);

    filters.init();
    filters.setFilterHandler(() => {
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

    if (this._points === undefined || !this._points.length) {
      this._renderEmpty();
      return;
    }

    const pointList = document.createElement(`ul`);
    pointList.classList.add(`trip-events__list`);

    this._container.appendChild(pointList);

    this._renderPoints(pointList);
  }

  _resetPoints() {
    this._pointObserver.run(`resetView`);
  }

  _clearTrip() {
    this._pointObserver.run((el) => {
      el.destroy();
    });

    this._empty.getElement().remove();

    this._pointObserver.clear();
  }
}
