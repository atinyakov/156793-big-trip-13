import {isOnline} from '../helpers/utils';
import toast from "../helpers/toast/toast.js";
import {API_CODES} from '../mock/constants';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needSync = false;
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
      data.then((dataFromServer) => this._store.setItems(dataFromServer, querry));

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

    return Promise.resolve(Object.assign(update, {status: API_CODES.OK}));
  }

  createData(update) {
    const created = this._api.createData(update);
    created.then((dataFromServer) => this._store.addItem(dataFromServer));

    return created;
  }

  deleteData(update) {
    const created = this._api.createData(update);
    created.then((dataFromServer) => this._store.removeItem(dataFromServer));

    return created;
  }

  get needSync() {
    return this._needSync;
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
