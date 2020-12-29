const URL = `https://13.ecmascript.pages.academy/big-trip`;

export default class API {
  constructor(url, auth) {
    this._url = url;
    this._auth = auth;
  }

  getPoints() {
    return this._client(`/points`)
    .then((res) => {
      if (res.ok) {
        return res;
      }
      return new Error(`Ошибка запроса точек маршрута`);
    })
    .then((res) => res.json())
    .then((parsed) => this._mapToClient(parsed));
    // .catch((e) => console.error(e.message));
  }

  getData(querry) {
    return this._client(querry)
    .then((res) => {
      if (res.ok) {
        return res;
      }
      return new Error(`Ошибка запроса дополнительных опций`);
    })
    .then((res) => res.json());
    // .catch((e) => console.error(e.message));
  }

  // id: nanoid(10),
  // type: POINT_TYPE[pointPosition],
  // destination: city,
  // startTime: dayjs(
  //     `2019-01-11 ${getRandomInteger(0, 1)}:${getRandomInteger(30, 59)}`,
  //     `YYYY-MM-DD H:m`
  // ).toDate(),
  // endTime: dayjs(
  //     `2019-01-1${getRandomInteger(1, 2)} ${getRandomInteger(1, 2)}:${getRandomInteger(0, 2)}`,
  //     `YYYY-MM-DD H:m`
  // ).toDate(),
  // price: getRandomInteger(1, 10) * 10,
  // offers: mapTypeToOffer.get(POINT_TYPE[pointPosition]), // id[]
  // isFavorite: !!getRandomInteger(0, 1),

  //   base_price: 800
  // date_from: "2020-12-27T08:21:58.677Z"
  // date_to: "2020-12-28T04:34:51.963Z"
  // destination: {name: "Saint Petersburg", description: "Saint Petersburg, is a beautiful city, a true asia…ddle East, a perfect place to stay with a family.", pictures: Array(4)}
  // id: "0"
  // is_favorite: false
  // offers: (2) [{…}, {…}]
  // type: "taxi"

  _mapToClient(res) {
    return new Promise((resolve) => {
      const mapped = res.map((el) => {
        const point = Object.assign(el, {
          isFavorite: el.is_favorite,
          destination: el.destination.name,
          description: el.destination.description,
          startTime: el.date_from,
          endTime: el.date_to,
          price: el.base_price

        });
        delete point.is_favorite;
        delete point.date_to;
        delete point.date_from;
        delete point.base_price;

        return point;
      });
      resolve(mapped);
    });
  }

  _client(querry, method = `GET`, body) {
    return fetch(`${URL}${querry}`, {method, headers: {
      'Authorization': `Basic ${this._auth}`
    }, body: body && JSON.stringify(body)});
  }
}
