import Header from '../view/header';
import {render, RenderPosition} from '../helpers/utils';

export default class StatsPresenter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.subscribe(this._handleModelEvent);
  }

  init() {
    this._points = this._pointsModel.getPoints(this._filterModel.getFilter());
    this._elem = new Header(this._points);
    this.render();
  }

  render() {
    render(this._container, this._elem, RenderPosition.AFTERBEGIN);
  }

  _handleModelEvent() {
    this._elem._updateData(this._pointsModel.getPoints(this._filterModel.getFilter()));
  }
}
