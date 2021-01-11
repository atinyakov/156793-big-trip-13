export default class Store {
  constructor(key, ls) {
    this._key = key;
    this._localStorage = ls;
  }

  getItems(key = this._key) {
    try {
      return JSON.parse(this._localStorage.getItem(key)) || {};
    } catch (err) {
      return {};
    }
  }


  setItems(items, key = this._key) {
    this._localStorage.setItem(
        key,
        JSON.stringify(items)
    );
  }

  addItem(value, key = this._key) {
    const store = this.getItems();

    this._localStorage.setItem(
        key,
        JSON.stringify([...store, value])
    );
  }

  updateItem(value, key = this._key) {
    const store = this.getItems();

    this._localStorage.setItem(
        key,
        JSON.stringify([...store].map((el) => el.id === value.id ? value : el))
    );
  }

  removeItem(item) {
    const store = this.getItems(this._key);

    this._localStorage.setItems(
        this._key,
        JSON.stringify(store.filter((el) => el.id !== item.id))
    );
  }

  remove(key = this._key) {
    this._localStorage.removeItem(key);
  }
}
