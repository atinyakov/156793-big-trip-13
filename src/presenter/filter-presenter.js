import dayjs from "dayjs";
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
    const currentFilter = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints(currentFilter);
    const config = {
      hasFuture: [...points].filter((a) => {
        return dayjs().diff(a.endTime, `m`) < 0;
      }).length,
      hasPast: [...points].filter((a) => {
        return dayjs().diff(a.endTime, `m`) > 0;
      }).length,
    };

    this._filters = new Filters(currentFilter, config);


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
