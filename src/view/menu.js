
import Abstract from './abstract';

const createMenu = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
<a class="trip-tabs__btn trip-tabs__btn--active"  data-page="table" href="#">Table</a>
<a class="trip-tabs__btn"  data-page="stats" href="#">Stats</a>
</nav>`;
};

export default class Menu extends Abstract {
  constructor(tripPresenter, statsPresenter) {
    super();
    this._tripPresenter = tripPresenter;
    this._statsPresenter = statsPresenter;

    this._setHandlers();
  }

  getTemplate() {
    return createMenu();
  }

  _setHandlers() {
    this.getElement().addEventListener(`click`, (e) => {
      e.preventDefault();

      if (e.target.dataset.page === `table`) {
        this._tripPresenter.show();
        this._statsPresenter.hide();
      } else {
        this._tripPresenter.hide();
        this._statsPresenter.show();
      }

      this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((el) => {
        el.classList.toggle(`trip-tabs__btn--active`);
      });
    });
  }
}
