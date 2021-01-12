import Filters from "../view/filters";
import {render, RenderPosition} from '../helpers/utils';

export default class FilterPresenter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this._updateFilter = this._updateFilter.bind(this);
  }

  init() {
    this._filters = new Filters(this._filterModel.getFilter());

    this.renderFilters();
  }

  setFilterHandler(cb) {
    this._filters.setFilterHandler((data) => {
      this._updateFilter(data);
      cb();
    });
  }

  _updateFilter(data) {
    this._filterModel.setFilter(data);
  }

  renderFilters() {
    render(this._container, this._filters, RenderPosition.BEFOREEND);
  }

  handleFilterChange() {
    this._filters._updateData(this._filterModel.getFilter());
  }
}
