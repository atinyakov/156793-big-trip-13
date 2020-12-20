import Observer from '../helpers/observers';
import dayjs from "dayjs";
import {FILTER_TYPE, UPDATE_TYPE} from '../mock/constants';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this.points = [];
  }

  setPoints(points) {
    this.points = [...points];
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
    // console.log(`inside UPDARE`, updateType);
    this.points = this.points.map((point) => {
      return point.id === update.id ? update : point;
    });

    this.notify(updateType, update);
  }

  addPoint(point) {
    this.points = [...this.points, point];

    this.notify(UPDATE_TYPE.MAJOR);

  }

  deletePoint(point) {
    // console.log(point);
    this.points = this.points.filter((el) => el.id !== point.id);

    // return this.points;
    this.notify(UPDATE_TYPE.MAJOR);

  }
}
