import Observer from '../helpers/observers';
import dayjs from "dayjs";
import {FilterType, UpdateType, ApiCodes} from '../mock/constants';
export default class PointsModel extends Observer {
  constructor(api) {
    super();
    this.api = api;
    this.points = [];
  }

  setPoints(points, update = false) {
    this.points = [...points];
    if (update) {
      this.notify(UpdateType.MAJOR);
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
      case FilterType.EVERYTHING:
        data = this.points;
        break;
      case FilterType.FUTURE:
        data = this.points.filter((point) => {
          return dayjs(point.endTime).diff(dayjs()) > 0;
        });
        break;
      case FilterType.PAST:
        data = this.points.filter((point) => {
          return dayjs(point.endTime).diff(dayjs()) < 0;
        });
    }
    return data;
  }

  updatePoint(updateType, update) {
    if (update.id === undefined) {
      this.notify(UpdateType.MAJOR);
      return;
    }

    this.api.updateData(update)
    .then((res) => {
      if (res.status === ApiCodes.OK) {
        this.setPoints(this.points = this.points.map((point) => {
          return point.id === update.id ? update : point;
        }));
        this.notify(updateType, update);
      }
    })
    .catch(() => {
      this.notify(UpdateType.PATCH, Object.assign(update, {hasError: true}));
    });
  }


  addPoint(point) {
    this.api.createData(point)
    .then((updatedPoint) => {
      this.setPoints([...this.points, ...updatedPoint], true);
    })
    .catch(() => {
      this.notify(UpdateType.PATCH, Object.assign(point, {hasError: true}));
    });
  }

  deletePoint(point) {
    this.api.deleteData(point)
    .then((res) => {
      if (res.status === ApiCodes.OK) {
        this.setPoints(this.points.filter((el) => el.id !== point.id), true);

        return;
      }
      throw new Error(`Cant delete point`);
    })
    .catch(() => {
      this.notify(UpdateType.PATCH, Object.assign(point, {hasError: true}));
    });
  }
}
