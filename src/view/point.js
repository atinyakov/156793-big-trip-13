import dayjs from "dayjs";
import Abstract from './abstract';


const calculateDuration = (start, end) => {
  const minutes = dayjs(end).diff(start, `m`);
  if (minutes / 60 < 1) {
    return `${minutes} М`;
  }

  return dayjs(dayjs(end).diff(start, `ms`)).format(`DD[D] HH[H] mm[M]`);
};

const createTemplate = ({
  type = `train`,
  destination = `Moscow`,
  price: eventPrice = 0,
  isFavorite = false,
  startTime = dayjs(),
  endTime,
  offers = [],
} = {}) => {
  const favoriteClasslist = `event__favorite-btn ${isFavorite && `event__favorite-btn--active`}`;

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${startTime}">${dayjs(startTime).format(`MMM D`)}</time>
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
      <p class="event__duration">${calculateDuration(startTime, endTime)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${eventPrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.reduce((acc, el) => {
    return acc + `<li class="event__offer">
            <span class="event__offer-title">${el.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${el.price}</span>
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
  constructor(data, offerByType, destinations) {
    super();
    this._data = Object.assign({},
        data,
        {
          pictures: destinations.find((el) => el.name === (data.destination || destinations[0].name)).pictures
        });
    this._offerByType = offerByType;
    this._callback = {};
  }

  getTemplate() {
    return createTemplate(this._data, this._offerByType);
  }

  _rollupHandler(e) {
    e.preventDefault();

    this._callback.rollup(e);
  }

  _favoriteHandler(e) {
    e.preventDefault();

    this._callback.favorite(this._data);
  }

  setRollupHandler(cb) {
    this._callback.rollup = cb;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, (e) => {
      this._rollupHandler(e);
    });
  }

  setFavoriteHandler(cb) {
    this._callback.favorite = cb;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, (e) => {
      this._favoriteHandler(e);
    });
  }
}
