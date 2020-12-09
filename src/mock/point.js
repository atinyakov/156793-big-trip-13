import {POINT_TYPE, CITIES, SENTENCES, mapTypeToOffer} from "./constants";
import {getRandomInteger} from "../helpers/utils";
import dayjs from "dayjs";
import {nanoid} from 'nanoid';


const createPointData = () => {
  const pointPosition = getRandomInteger(0, POINT_TYPE.length - 1);

  return {
    id: nanoid(10),
    type: POINT_TYPE[pointPosition],
    destination: CITIES[getRandomInteger(0, CITIES.length - 1)],
    startTime: dayjs(
        `2019-01-11 ${getRandomInteger(0, 1)}:${getRandomInteger(30, 59)}`,
        `YYYY-MM-DD H:m`
    ).toDate(),
    endTime: dayjs(
        `2019-01-1${getRandomInteger(1, 2)} ${getRandomInteger(1, 2)}:${getRandomInteger(0, 2)}`,
        `YYYY-MM-DD H:m`
    ).toDate(),
    price: getRandomInteger(1, 10) * 10,
    offers: mapTypeToOffer.get(POINT_TYPE[pointPosition]),
    isFavorite: !!getRandomInteger(0, 1),
    pictures: Array(getRandomInteger(1, 5))
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
    description: Array(getRandomInteger(1, 4)).fill().reduce((acc) => {
      return acc.concat(` ${SENTENCES[getRandomInteger(0, SENTENCES.length - 1)]}`);
    }, ``)
  };
};

export const points = Array(20)
  .fill()
  .map(() => createPointData())
  .sort((a, b) => {
    return dayjs(a.startTime).diff(b.startTime, `m`) < 0 ? 1 : -1;
  });
