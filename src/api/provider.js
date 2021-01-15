import {isOnline} from '../helpers/utils';
import toast from "../helpers/toast/toast.js";
import {ApiCodes} from '../mock/constants';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  get needSync() {
    return this._needSync;
  }

  getPoints() {
    if (isOnline()) {
      const points = this._api.getPoints();
      points.then((data) => this._store.setItems(data));

      return points;
    }

    this._needSync = true;
    return Promise.resolve(this._store.getItems());
  }

  getData(querry) {
    if (isOnline()) {
      const data = this._api.getData(querry);
      data
      .then((dataFromServer) => this._store.setItems(dataFromServer, querry))
      .catch((e) => new Error(`Can't update localstorage: ${e.message}`));

      return data;
    }
    this._needSync = true;

    return Promise.resolve(this._store.getItems(querry));
  }

  updateData(update) {
    if (isOnline()) {
      const updated = this._api.updateData(update);
      this._store.updateItem(update);

      return updated;
    }

    this._store.updateItem(update);
    this._needSync = true;

    return Promise.resolve(Object.assign(update, {status: ApiCodes.OK}));
  }

  createData(update) {
    if (isOnline()) {
      const created = this._api.createData(update);
      created
      .then((dataFromServer) => this._store.addItem(dataFromServer))
      .catch((e) => new Error(`Can't update localstorage: ${e.message}`));

      return created;
    }
    return Promise.reject(`Cant create in offline`);
  }

  deleteData(update) {
    if (isOnline()) {

      const created = this._api.deleteData(update);
      created
      .then((dataFromServer) => this._store.removeItem(dataFromServer))
      .catch((e) => new Error(`Can't update localstorage: ${e.message}`));

      return created;
    }
    return Promise.reject(`Cant delete in offline`);
  }

  sync() {
    if (isOnline()) {
      const stored = this._store.getItems();


      return this._api.sync(stored)
        .then(({created, updated}) => {
          this._store.setItems([...created, ...updated]);
          toast(`All the data saved`);
          this._needSync = false;
        });

    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
