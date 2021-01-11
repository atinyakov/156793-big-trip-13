const API_CODES = {
  OK: 200
};
export default class API {
  constructor(url, auth) {
    this._url = url;
    this._auth = auth;
  }

  getPoints() {
    return this._client(`/points`)
    .then((res) => {
      if (res.status === API_CODES.OK) {
        return res;
      }
      return new Error(`Ошибка запроса точек маршрута`);
    })
    .then((res) => res.json())
    .then((parsed) => this._mapToClient(parsed));
  }

  getData(querry) {
    return this._client(querry)
    .then((res) => {
      if (res.status === API_CODES.OK) {
        return res;
      }
      return new Error(`Ошибка запроса дополнительных опций`);
    })
    .then((res) => res.json());
  }

  updateData(update) {
    const body = this._mapToServer(update);

    return this._client(`/points/${body.id}`, {method: `PUT`, body});
  }

  createData(update) {
    const body = this._mapToServer(update);
    return this._client(`/points`, {method: `POST`, body})
    .then((res) => {
      if (res.status === API_CODES.OK) {
        return res;
      }
      throw new Error(`Cant add point`);
    })
    .then((res) => res.json())
    .then((parsed) => this._mapToClient([parsed]));
  }

  deleteData(update) {
    return this._client(`/points/${update.id}`, {method: `DELETE`});
  }

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

  _mapToServer(data) {
    return {
      [`base_price`]: +data.price,
      [`date_from`]: data.startTime,
      [`date_to`]: data.endTime,
      [`is_favorite`]: data.isFavorite,
      destination: {
        description: data.description,
        name: data.destination,
        pictures: data.pictures},
      id: data.id,
      offers: data.offers,
      type: data.type
    };
  }

  _client(querry, {method, body} = {method: `GET`}) {
    return fetch(`${this._url}${querry}`,
        {method,
          headers: method !== `GET` ? Object.assign({}, {'Authorization': `Basic ${this._auth}`, 'Content-Type': `application/json;charset=UTF-8`}) : {'Authorization': `Basic ${this._auth}`},
          body: body && JSON.stringify(body)});
  }

  sync(body) {
    // return this._load({
    //   url: `tasks/sync`,
    //   method: Method.POST,
    //   body: JSON.stringify(data),
    //   headers: new Headers({"Content-Type": `application/json`})
    // })
    //   .then(Api.toJSON);

    return this._client(`/points/sync`, {method: `POST`, body});
  }
}