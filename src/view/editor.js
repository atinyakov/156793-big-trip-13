import dayjs from "dayjs";
import Smart from './smart';
import {CITIES, CITIES_DATA, mapTypeToOffer} from "../mock/constants";

// import {OFFERS, CITIES} from '../mock/constants';

const createEditor = ({
  type = `train`,
  destination = `Moscow`,
  price: eventPtice = 0,
  startTime = ``,
  endTime = ``,
  offers = []
}, mode = `add`) => {

  const map = {
    [`Add luggage`]: `luggage`,
    [`Switch to comfort class`]: `comfort`,
    [`Choose seats`]: `seats`,
    [`Travel by train`]: `train`,
    [`Add meal`]: `meal`,
    [`Order Uber`]: `uber`,
  };

  const derivedType = ([initial, ...rest]) => [initial.toUpperCase(), ...rest].join(``);

  const offersMarkup = mapTypeToOffer.get(derivedType(type)).reduce((acc, {title, price}) => {
    return acc.concat(
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${map[title]}" type="checkbox" name="event-offer-${map[title]}" ${offers.findIndex((offer) => offer.title === title) !== -1 && `checked`}>
        <label class="event__offer-label" for="event-offer-${map[title]}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`);
  }, ``);

  // const picturesMarkup = CITIES_DATA.reduce((acc, url) => {
  //   return acc.concat(
  //       `<img class="event__photo" src="${url}" alt="Event photo">`);
  // }, ``);
  const point = CITIES_DATA.find((el) => el.name === destination);

  const picturesMarkup = point.pictures.reduce((acc, url) => {
    return acc.concat(
        `<img class="event__photo" src="${url}" alt="Event photo">`);
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

            <div class="event__type-item">
              <input id="event-type-taxi" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === `Taxi` && `checked`}>
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === `Bus` && `checked`}>
              <label class="event__type-label  event__type-label--bus" for="event-type-bus">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === `Train` && `checked`}>
              <label class="event__type-label  event__type-label--train" for="event-type-train">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === `Ship` && `checked`}>
              <label class="event__type-label  event__type-label--ship" for="event-type-ship">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${type === `Transport` && `checked`}>
              <label class="event__type-label  event__type-label--transport" for="event-type-transport">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === `Drive` && `checked`}>
              <label class="event__type-label  event__type-label--drive" for="event-type-drive">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === `Flight` && `checked`}>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === `Check-in` && `checked`}>
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === `Sightseeing` && `checked`}>
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === `Restaurant` && `checked`}>
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${destination}" list="destination-list">
        <datalist id="destination-list">
          ${CITIES.reduce((acc, city) => acc + `<option value=${city}>${city}</option>`, ``)}
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
        <input class="event__input  event__input--price" id="event-price" type="text" name="event-price" value="${eventPtice}">
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
        <p class="event__destination-description">${point.description}</p>
        ${mode === `edit` ? `<div class="event__photos-container">
           <div class="event__photos-tape">${picturesMarkup}</div>
        </div>` : ``}
      </section>
    </section>
  </form>
</li>`;
};

export default class Editor extends Smart {
  constructor(data, mode) {
    super();
    this._data = data;
    this._mode = mode;
    this._callback = {};
    this._clickHandler = this._clickHandler.bind(this);
    this._resetHandler = this._resetHandler.bind(this);
    this._typeHandler = this._typeHandler.bind(this);
    this._cityHandler = this._cityHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditor(this._data, this._mode);
  }

  _clickHandler(e) {
    e.preventDefault();
    this._callback.click();
  }

  _submitHandler(e) {
    e.preventDefault();
    this._callback.submit();
  }

  _resetHandler(e) {
    e.preventDefault();
    this._callback.reset();
  }

  _typeHandler(e) {
    e.preventDefault();

    this._updateData({type: e.target.value});
  }

  _cityHandler(e) {
    e.preventDefault();

    this._updateData({destination: e.target.value});
  }

  setClickHandler(cb) {
    this._callback.click = cb;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setSubmitHandler(cb) {
    this._callback.submit = cb;

    this.getElement().querySelector(`form`).addEventListener(`submit`, (e) => this._submitHandler(e));
  }

  setResetHandler(cb) {
    this._callback.reset = cb;

    this.getElement().querySelector(`form`).addEventListener(`reset`, this._resetHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._typeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setClickHandler(this._callback.click);
    this.setSubmitHandler(this._callback.submit);
    this.setResetHandler(this._callback.reset);
  }
}
