import {FILTER_TYPE} from '../mock/constants';

export default class FilterModel {
  constructor() {
    this._filter = FILTER_TYPE.EVERYTHING;
  }

  setFilter(filter) {
    this._filter = filter;
  }

  getFilter() {
    return this._filter;
  }


}
