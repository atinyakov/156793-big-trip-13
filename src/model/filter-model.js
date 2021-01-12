import {FILTER_TYPE} from '../mock/constants';
import Observer from '../helpers/observers';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._filter = FILTER_TYPE.EVERYTHING;
  }

  setFilter(filter) {
    this._filter = filter;
    this.notify(); // только что
  }

  getFilter() {
    return this._filter;
  }
}
