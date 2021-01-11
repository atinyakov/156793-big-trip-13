import {isOnline} from '../helpers/utils';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline) {
      const points = this._api.getPoints();
      points.then((data) => this._store.setItems(data));

      return points;
    }

    return Promise.resolve(this._store.getData());
  }

  getData(querry) {
    if (isOnline) {
      const data = this._api.getData(querry);
      data.then((dataFromServer) => this._store.setItems(dataFromServer, querry));

      return data;
    }

    return Promise.resolve(this._store.getData(querry));
  }

  updateData(update) {
    if (isOnline) {
      const updated = this._api.updateData(update);
      updated.then((dataFromServer) => this._store.setItem(dataFromServer));

      return update;
    }

    this._store.setItem(update);
    return Promise.resolve(this._store.getData());
  }

  createData(update) {
    // TODO: all
    if (isOnline) {

      return this._api.createData(update);
    }
    return undefined;
  }

  deleteData(update) {
    // TODO: all
    return this._api.deleteData(update);
  }
}
