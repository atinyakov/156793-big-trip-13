import dayjs from "dayjs";
import Abstract from './abstract';

const duration = (start, end) => {
  const minutes = dayjs(end).diff(start, `m`);
  if (minutes / 60 < 1) {
    return `${minutes} М`;
  }
  const hasDays = minutes / (24 * 60) > 1;

  return hasDays ? dayjs(dayjs(end).diff(start)).format(`DD[D] HH[H] mm[M]`) : dayjs(dayjs(end).diff(start, `m`)).format(` HH[H] mm[M]`);
};

const createTemplate = ({
  type = `train`,
  destination = `Moscow`,
  price: eventPtice,
  isFavorite = `false`,
  startTime,
  endTime,
  offers,
} = {}) => {
  const favoriteClasslist = `event__favorite-btn ${isFavorite && `event__favorite-btn--active`}`;


  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="datetime="${startTime}">${dayjs(startTime).format(`MMM D`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${startTime}">${dayjs(startTime).format(`H:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${endTime}">${dayjs(endTime).format(`H:mm`)}</time>
      </p>
      <p class="event__duration">${duration(startTime, endTime)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${eventPtice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.reduce((acc, {title, price}) => {
    return acc + `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
  }, ``)}
    </ul>
    <button class="${favoriteClasslist}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class Point extends Abstract {
  constructor(data) {
    super();
    this._data = data;
    this._callback = {};
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  _clickHandler(e) {
    e.preventDefault();

    this._callback.click(e);
  }

  setClickHandler(cb) {
    this._callback.click = cb;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, (e) => {
      this._clickHandler(e);
    });
  }
}
