import SmartWithHandlers from './smart-with-handlers';

const createFilters = (filter, {hasFuture, hasPast}) => {
  return `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${filter === `everything` ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${!hasFuture ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${!hasPast ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filters extends SmartWithHandlers {
  constructor(currentFilter, config) {
    super();
    this._filter = currentFilter;
    this._config = config;
    this._callbacks = {};
    this._changeFilterHandler = this._changeFilterHandler.bind(this);
  }

  getTemplate() {
    return createFilters(this._filter, this._config);
  }

  _changeFilterHandler(e) {
    e.preventDefault();

    this._callbacks.click(e.target.value);
  }

  setFilterHandler(cb) {
    this._callbacks.click = cb;

    this.getElement().addEventListener(`change`, this._changeFilterHandler);
  }

  restoreHandlers() {
    this.setFilterHandler(this._callbacks.click);
  }
}
