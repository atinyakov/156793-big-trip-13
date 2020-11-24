import dayjs from "dayjs";

export const createTripHeader = (points) => {
  const cost = points.reduce((acc, {price})=> {
    return acc + +price;
  }, 0);

  const title = () => {
    if (points.length > 3) {
      return `${points[0].destination} &mdash; ... &mdash; ${points[points.length - 1].destination}`;
    }
    return `${points[0].destination} &mdash; ${points[1].destination} &mdash; ${points[2].destination}`;
  };

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${title()}</h1>

    <p class="trip-info__dates">${dayjs(points[0].startDate).format(`MMM D`)} &nbsp; &mdash;&nbsp;${dayjs(points[points.length - 1].startDate).format(`MMM D`)}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
};
