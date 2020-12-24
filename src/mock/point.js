import {POINT_TYPE, CITIES, mapTypeToOffer} from "./constants";
import {getRandomInteger} from "../helpers/utils";
import dayjs from "dayjs";
import {nanoid} from 'nanoid';


const createPointData = () => {
  const pointPosition = getRandomInteger(0, POINT_TYPE.length - 1);
  const city = CITIES[getRandomInteger(0, CITIES.length - 1)];

  return {
    id: nanoid(10),
    type: POINT_TYPE[pointPosition],
    destination: city,
    startTime: dayjs(
        `2019-01-11 ${getRandomInteger(0, 1)}:${getRandomInteger(30, 59)}`,
        `YYYY-MM-DD H:m`
    ).toDate(),
    endTime: dayjs(
        `2019-01-1${getRandomInteger(1, 2)} ${getRandomInteger(1, 2)}:${getRandomInteger(0, 2)}`,
        `YYYY-MM-DD H:m`
    ).toDate(),
    price: getRandomInteger(1, 10) * 10,
    offers: mapTypeToOffer.get(POINT_TYPE[pointPosition]), // id[]
    isFavorite: !!getRandomInteger(0, 1),
  };
};

export const points = Array(20)
  .fill()
  .map(() => createPointData());
