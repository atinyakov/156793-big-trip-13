import dayjs from "dayjs";
let customParseFormat = require(`dayjs/plugin/customParseFormat`);
dayjs.extend(customParseFormat);
import Smart from './smart';
import {MODE} from "../mock/constants";


const derivedType = ([initial, ...rest]) => [initial.toUpperCase(), ...rest].join(``);
const createEditor = ({
  type = `train`,
  destination,
  description,
  price: eventPrice = 0,
  startTime,
  endTime,
  offers = [],
  pictures = [],
}, mode = `add`, offersByType, destinations) => {
  const currentTypeData = offersByType.find((el) => el.type === type);

  const offersMarkup = currentTypeData.offers.map((current, index) => {
    return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${currentTypeData.type}" ${offers.findIndex((c) => c.title === current.title) !== -1 && `checked`}>
        <label class="event__offer-label" for="event-offer-${index}">
          <span class="event__offer-title">${current.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${current.price}</span>
        </label>
      </div>`;
  }).join(``);

  const picturesMarkup = pictures.reduce((acc, {src, description: alt}) => {
    return acc.concat(
        `<img class="event__photo" src="${src}" alt="${alt}">`);
  }, ``);

  const typesData = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
  const types = typesData.reduce((acc, data) => {
    return acc.concat(
        `<div class="event__type-item">
        <input id="event-type-${data}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${data}" ${type === derivedType(data)
           && `checked`}>
        <label class="event__type-label  event__type-label--${data}" for="event-type-${data}">${derivedType(data)}</label>
      </div>`
    );
  }, ``);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${types}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination">
          ${type}
        </label>
        <input pattern="${destinations.map((el) => el.name).join(`|`)}" class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${destination}" list="destination-list">
        <datalist id="destination-list">
          ${destinations.reduce((acc, city) => acc + `<option value=${city.name}>${city.name}</option>`, ``)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time">From</label>
        <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${dayjs(startTime).format(`DD/MM/YY HH:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time">To</label>
        <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${dayjs(endTime).format(`DD/MM/YY HH:mm`)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price" type="number" name="event-price" value="${eventPrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersMarkup}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${mode === MODE.EDITING && !!pictures.length ? `<div class="event__photos-container">
           <div class="event__photos-tape">${picturesMarkup}</div>
        </div>` : ``}
      </section>
    </section>
  </form>
</li>`;
};

export default class Editor extends Smart {
  constructor(data, mode, offersByType, destinations) {
    super();
    this._offersByType = offersByType;
    this._destinations = destinations;
    this._data = Object.assign(
        {
          offers: [],
          type: `train`,
          price: 0,
          startTime: dayjs(),
          endTime: dayjs(),
          isFavorite: false,
          destination: destinations[0].name,
          description: destinations.find((el) => el.name === (data.destination || destinations[0].name)).description},
        data, {pictures: destinations.find((el) => el.name === (data.destination || destinations[0].name)).pictures});
    this._mode = mode;
    this._current = data;
    this._callback = {};
    this._clickHandler = this._clickHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._typeHandler = this._typeHandler.bind(this);
    this._cityHandler = this._cityHandler.bind(this);
    this._endDateHandler = this._endDateHandler.bind(this);
    this._startDateHandler = this._startDateHandler.bind(this);
    this._offerHandler = this._offerHandler.bind(this);
    this._priceHandler = this._priceHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditor(this._data, this._mode, this._offersByType, this._destinations);
  }

  _clickHandler(e) {
    e.preventDefault();
    this._updateData(this._current);

    this._callback.click();
  }

  _submitHandler(e, data) {
    e.preventDefault();
    this._callback.submit(data);
  }

  _deleteHandler(e) {
    e.preventDefault();
    this._callback.delete(this._data);
  }

  _typeHandler(e) {
    e.preventDefault();

    this._updateData({type: e.target.value, offers: []});
  }

  _cityHandler(e) {
    e.preventDefault();

    this._updateData({destination: e.target.value});

  }

  _startDateHandler(e) {
    e.preventDefault();

    this._updateData({startTime: dayjs(e.target.value, `DD/MM/YY HH:mm`).toISOString()}, true);
  }

  _endDateHandler(e) {
    e.preventDefault();

    this._updateData({endTime: dayjs(e.target.value, `DD/MM/YY HH:mm`).toISOString()}, true);
  }

  _priceHandler(e) {
    e.preventDefault();

    this._updateData({price: e.target.value}, true);
  }

  _offerHandler(e) {
    e.preventDefault();

    const offerIndex = e.target.id.replace(`event-offer-`, ``);
    const currentType = this._offersByType.find((el) => el.type === this._data.type);


    if (e.target.checked) {
      this._updateData({offers: this._data.offers.length ? [...this._data.offers, currentType.offers[offerIndex]] : currentType.offers[offerIndex]}, true);

    } else {
      this._updateData({offers: this._data.offers.filter((off) => JSON.stringify(off) !== JSON.stringify(currentType.offers[offerIndex]))}, true);
    }
  }

  setClickHandler(cb) {
    this._callback.click = cb;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setSubmitHandler(cb) {
    this._callback.submit = cb;

    const form = this.getElement().querySelector(`form`);

    form.addEventListener(`submit`, (e) => {
      e.preventDefault();

      this._submitHandler(e, this._data);
    });
  }

  setDeleteHandler(cb) {
    this._callback.delete = cb;

    this.getElement().querySelector(`form`).addEventListener(`reset`, this._deleteHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._typeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityHandler);
    this.getElement().querySelector(`#event-start-time`).addEventListener(`keyup`, this._startDateHandler);
    this.getElement().querySelector(`#event-end-time`).addEventListener(`keyup`, this._endDateHandler);
    this.getElement().querySelector(`#event-price`).addEventListener(`change`, this._priceHandler);
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offerHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setClickHandler(this._callback.click);
    this.setSubmitHandler(this._callback.submit);
    this.setDeleteHandler(this._callback.delete);
  }
}
