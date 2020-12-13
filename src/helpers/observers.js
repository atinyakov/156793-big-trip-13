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

  update(data, index) {
    this._observers = this._observers.map((observer) => {

      if (observer.getPointData().id === data.id) {
        observer.init(data, index);
      }

      return observer;
    });
  }

  run(method) {
    this._observers.forEach((observer) => observer[method]());
  }
}
