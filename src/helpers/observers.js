export default class Observers {
  constructor() {
    this._observers = [];
  }

  subscribe(item) {
    this._observers.push(item);
  }

  unsubscribe(item) {
    this._observers = this._observers.filter((observer) => observer === item);
  }

  clear() {
    this._observers = [];
  }

  run(method) {
    if (typeof method === `function`) {
      this._observers.forEach((observer) => method(observer));
      return;
    }
    this._observers.forEach((observer) => observer[method]());
  }

  notify(...args) {
    this._observers.forEach((observer) => observer(...args));
  }
}
