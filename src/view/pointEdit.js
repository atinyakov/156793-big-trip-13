import dayjs from "dayjs";

import {OFFERS, CITIES} from '../mock/constants';

export const createPointEditor = ({
  type = `train`,
  destination = `Moscow`,
  price: eventPtice = 0,
  startTime = ``,
  endTime = ``,
  offers = [],
  description = ``,
  pictures = []
}, index, mode = `add`) => {

  const map = {
    [`Add luggage`]: `luggage`,
    [`Switch to comfort class`]: `comfort`,
    [`Choose seats`]: `seats`,
    [`Travel by train`]: `train`,
    [`Add meal`]: `meal`,
    [`Order Uber`]: `uber`,
  };

  const offersMarkup = OFFERS.reduce((acc, {title, price}) => {
    return acc.concat(
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${map[title]}-${index}" type="checkbox" name="event-offer-${map[title]}" ${offers.findIndex((offer) => offer.title === title) !== -1 && `checked`}>
        <label class="event__offer-label" for="event-offer-${map[title]}-${index}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`);
  }, ``);

  const picturesMarkup = pictures.reduce((acc, url) => {
    return acc.concat(
        `<img class="event__photo" src="${url}" alt="Event photo">`);
  }, ``);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${index}}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${index}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${index}">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-${index}">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-${index}">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-${index}">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-${index}">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-${index}">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-${index}">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${index}">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${index}">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${index}">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${index}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${index}" type="text" name="event-destination" value="${destination}" list="destination-list-${index}">
        <datalist id="destination-list-${index}">
          ${CITIES.map((city) => `<option value=${city}></option>`)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${index}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${index}" type="text" name="event-start-time" value="${dayjs(startTime).format(`DD/MM/YY HH:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${index}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${index}" type="text" name="event-end-time" value="${dayjs(endTime).format(`DD/MM/YY HH:mm`)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${index}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${index}" type="text" name="event-price" value="${eventPtice}">
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
        <div class="event__photos-container">
          ${mode === `add` && `<div class="event__photos-tape">${picturesMarkup}</div>`}
      </div>
      </section>
    </section>
  </form>
</li>`;
};
