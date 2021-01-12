import Sorting from '../view/sorting';
import {render, RenderPosition} from '../helpers/utils';
import {SORT_TYPE} from '../mock/constants';

export default class SortingPresenter {
  constructor(container, filterModel) {
    this._container = container;
    this.currentValue = SORT_TYPE.DAY;
    this._filterModel = filterModel;

    this.handleModelEvent = this.handleModelEvent.bind(this);
    this._filterModel.subscribe(this.handleModelEvent);
  }

  init() {
    this._elem = new Sorting();

    this.render();
    this._elem.setHandler((data) => this.setCurrentValue(data));
  }

  setHandler(cb) {
    this._cb = cb;
  }

  getCurrentValue() {
    return this.currentValue;
  }

  setCurrentValue(data) {
    if (this.currentValue === data) {
      return;
    }

    this.currentValue = data;
    this._cb();
  }

  render() {
    render(this._container, this._elem, RenderPosition.AFTERBEGIN);
  }

  handleModelEvent() {
    this._elem._updateData(this.currentValue);
  }
}
