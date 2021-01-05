import Observer from '../helpers/observers';
import dayjs from "dayjs";
import {FILTER_TYPE, UPDATE_TYPE} from '../mock/constants';

export default class PointsModel extends Observer {
  constructor(api) {
    super();
    this.api = api;
    this.points = [];
  }

  setPoints(points, update = false) {
    this.points = [...points];
    if (update) {
      this.notify(UPDATE_TYPE.MAJOR);
    }
  }

  setData(name, data) {
    this[name] = data;
  }

  getData(name) {
    if (!this[name]) {
      throw new Error(`property ${name} does not exist on ${this}`);
    }
    return this[name];
  }

  getPoints(filter) {
    let data;
    switch (filter) {
      case FILTER_TYPE.EVERYTHING:
        data = this.points;
        break;
      case FILTER_TYPE.FUTURE:
        data = this.points.filter((point) => {
          return dayjs(point.endTime).diff(dayjs()) > 0;
        });
        break;
      case FILTER_TYPE.PAST:
        data = this.points.filter((point) => {
          return dayjs(point.endTime).diff(dayjs()) < 0;
        });
    }
    return data;
  }

  updatePoint(updateType, update) {
    if (update.id === undefined) {
      this.notify(UPDATE_TYPE.MAJOR);
      return;
    }

    this.api.updateData(update).then((res) => {
      if (res.status === 200) {
        this.points = this.points.map((point) => {
          return point.id === update.id ? update : point;
        });
        this.notify(updateType, update);
      }
      throw new Error(`Cant update point`);

    })
    .catch(() => {
      this.notify(UPDATE_TYPE.PATCH, Object.assign(update, {hasError: true}));
    });
  }


  addPoint(point) {
    this.api.createData(point)
    .then((updatedPoint) => {
      this.points = [...this.points, ...updatedPoint];
      this.notify(UPDATE_TYPE.MAJOR);
    })
    .catch(() => {
      this.notify(UPDATE_TYPE.PATCH, Object.assign(point, {hasError: true}));
    });
  }

  deletePoint(point) {
    this.api.deleteData(point)
    .then((res) => {
      if (res.status === 200) {
        this.points = this.points.filter((el) => el.id !== point.id);
        this.notify(UPDATE_TYPE.MAJOR);
      }
      throw new Error(`Cant delete point`);
    })
    .catch(() => {
      this.notify(UPDATE_TYPE.PATCH, Object.assign(point, {hasError: true}));
    });
  }
}
