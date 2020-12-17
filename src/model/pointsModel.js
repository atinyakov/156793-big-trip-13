import Observer from '../helpers/observers';
import dayjs from "dayjs";
import {FILTER_TYPE} from '../mock/constants';

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

  updatePoint(update) {
    this.points = this.points.map((point) => {
      return point.id === update.id ? update : point;
    });

    return this.points;
  }

}
