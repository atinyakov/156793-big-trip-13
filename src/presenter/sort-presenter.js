import Sorting from '../view/sorting';
import {render, RenderPosition} from '../helpers/utils';
import {SORT_TYPE} from '../mock/constants';

export default class SortingPresenter {
  constructor(container) {
    this._container = container;
    this.currentValue = SORT_TYPE.DAY;
  }

  init() {
    this._component = new Sorting();

    this.render();
    this._component.setHandler((data) => this.setCurrentValue(data));
  }

  setHandler(cb) {
    this._cb = cb;
  }

  getCurrentValue() {
    return this.currentValue;
  }

  setCurrentValue(data) {
    if (this._currentValue === data) {
      return;
    }

    this.currentValue = data;
    this._cb();
  }

  render() {
    render(this._container, this._component, RenderPosition.AFTERBEGIN);
  }
}
