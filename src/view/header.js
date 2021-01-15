import dayjs from "dayjs";
import Smart from './smart';


const createHeader = (points) => {
  const cost = points.length ? points.reduce((acc, {offers, price}) => {
    let offersPrice = 0;

    if (offers !== undefined) {
      offersPrice = offers.reduce((offAcc, el) => offAcc + +el.price, offersPrice);
    }

    return acc + +price + offersPrice;
  }, 0) : 0;

  const createTitle = () => {
    if (points.length === 0) {
      return ``;
    }
    if (points.length > 3) {
      return `${points[0].destination} &mdash; ... &mdash; ${points[points.length - 1].destination}`;
    }
    return `${points[0].destination} &mdash; ${points[1].destination} &mdash; ${points[2].destination}`;
  };

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${createTitle()}</h1>

    <p class="trip-info__dates">${points.length ? dayjs(points[0].startTime).format(`MMM D`) : ``} &nbsp; &mdash;&nbsp;${points.length ? dayjs(points[points.length - 1].endTime).format(`MMM D`) : ``}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
};

export default class Header extends Smart {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createHeader(this._data);
  }
}
