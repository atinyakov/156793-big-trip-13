import {POINT_TYPE, CITIES, OFFERS} from "./constants";
import {getRandomInteger} from "../helpers/utils";
import dayjs from "dayjs";

export const createPointData = () => ({
  type: POINT_TYPE[getRandomInteger(0, POINT_TYPE.length - 1)],
  destination: CITIES[getRandomInteger(0, CITIES.length - 1)],
  startTime: dayjs(
      `2019-01-11 ${getRandomInteger(0, 1)}:${getRandomInteger(30, 59)}`,
      `YYYY-MM-DD H:m`
  ).toDate(),
  endTime: dayjs(
      `2019-01-1${getRandomInteger(1, 2)} ${getRandomInteger(1, 2)}:${getRandomInteger(0, 2)}`,
      `YYYY-MM-DD H:m`
  ).toDate(),
  price: `${getRandomInteger(1, 10) * 10}`,
  offers: [OFFERS[getRandomInteger(0, OFFERS.length - 1)]],
  isFavorite: !!getRandomInteger(0, 1),
  pictures: Array(getRandomInteger(1, 5))
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`,
});
