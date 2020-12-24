import Sorting from '../view/sorting';
import {render, RenderPosition} from '../helpers/utils';


export default class SortingPresenter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    // this._updateFilter = this._updateFilter.bind(this);
  }

  init() {
    this._component = new Sorting();

    this.render();
  }

  setHandler(cb) {
    this._component.setFilterHandler((data) => {
      this._updateFilter(data);
      cb();
    });
  }

  _update(data) {
    this._filterModel.setFilter(data);
  }

  render() {
    render(this._container, this._component, RenderPosition.BEFOREEND);
  }
}
