import {FilterType} from '../mock/constants';
import Observer from '../helpers/observers';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._filter = FilterType.EVERYTHING;
  }

  setFilter(filter) {
    this._filter = filter;
    this.notify();
  }

  getFilter() {
    return this._filter;
  }
}
