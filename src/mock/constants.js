export const POINT_TYPE = [
  `Taxi`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
  `Bus`,
];


import {getRandomInteger} from "../helpers/utils";

export const CITIES = [
  `Москва`,
  `Омск`,
  `Самара`,
  `Тула`,
  `Уфа`,
  `В.Новгород`,
];
const createDescription = () => Array(getRandomInteger(1, 4)).fill().reduce((acc) => {
  return acc.concat(` ${SENTENCES[getRandomInteger(0, SENTENCES.length - 1)]}`);
}, ``);

const createPictures = () => Array(getRandomInteger(1, 5))
.fill()
.map(() => `http://picsum.photos/248/152?r=${getRandomInteger(0, 1000)}`);


export const OFFERS = [
  {
    title: `Add luggage`,
    price: 30
  },
  {
    title: `Switch to comfort class`,
    price: 100,
  },
  {
    title: `Add meal`,
    price: 15
  },
  {
    title: `Choose seats`,
    price: 5
  },
  {
    title: `Travel by train`,
    price: 40,
  },
  {
    title: `Order Uber`,
    price: 20,
  }
];

export const mapTypeToOffer = new Map([
  [POINT_TYPE[0], [OFFERS[5]]],
  [POINT_TYPE[2], [OFFERS[2]]],
  [POINT_TYPE[1], [OFFERS[4], OFFERS[2]]],
  [POINT_TYPE[3], [OFFERS[4], OFFERS[5]]],
  [POINT_TYPE[4], [OFFERS[1]]],
  [POINT_TYPE[5], [OFFERS[0], OFFERS[3]]],
  [POINT_TYPE[6], [OFFERS[1]]],
  [POINT_TYPE[7], [OFFERS[2]]],
  [POINT_TYPE[8], [OFFERS[2]]],
  [POINT_TYPE[9], [OFFERS[0]]],
]);

export const SENTENCES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus`
];

const data = [
  {name: `Москва`},
  {name: `Омск`},
  {name: `Самара`},
  {name: `Тула`},
  {name: `Уфа`},
  {name: `В.Новгород`},
];

export const CITIES_DATA = data.map((city) => {
  return Object.assign(city, {pictures: createPictures(), description: createDescription()});
});

export const FILTER_TYPE = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const SORT_TYPE = {
  DAY: `sort-day`,
  TYPE: `sort-type`,
  PRICE: `sort-price`,
};

export const USER_ACTION = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UPDATE_TYPE = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const MODE = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  ADD: `ADD`
};
