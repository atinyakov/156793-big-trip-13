import Point from "../view/point";
import Editor from "../view/editor";

import {MODE, UPDATE_TYPE} from '../mock/constants';
import {render, RenderPosition, replace} from '../helpers/utils';


export default class PointPresenter {
  constructor(container, pointsModel, resetPoints) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._resetPoints = resetPoints;
    this._mode = MODE.DEFAULT;
    this._closeEditor = this._closeEditor.bind(this);
    this._closeEditorByEsc = this._closeEditorByEsc.bind(this);
    this.getPointData = this.getPointData.bind(this);
  }

  init(point, mode = MODE.EDITING) {
    this._point = point;

    if (Object.keys(this._point).length === 1) {
      this._mode = MODE.ADD;
    }

    const oldPoint = this._pointComponent;
    const oldEditor = this._pointEditorComponent;

    this._pointComponent = new Point(point);
    this._pointEditorComponent = new Editor(point, mode);

    this._pointComponent.setRollupHandler(() => {
      document.addEventListener(`keydown`, this._closeEditorByEsc);
      this._resetPoints();

      replace(this._pointEditorComponent, this._pointComponent);
      this._mode = MODE.EDITING;
    });

    this._pointComponent.setFavoriteHandler(() => {
      this._pointsModel.updatePoint(UPDATE_TYPE.PATCH, Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
    });

    this._pointEditorComponent.setClickHandler(this._closeEditor);
    this._pointEditorComponent.setSubmitHandler((data) => {

      // добавить обработку offer
      const dataToPoint = {
        id: data.id,
        destination: data[`event-destination`],
        startDate: data[`event-start-time`],
        endDate: data[`event-end-time`],
        price: data[`event-price`],
        isFavorite: false,
      };

      this._pointsModel.updatePoint(UPDATE_TYPE.MAJOR, Object.assign({}, this._point, dataToPoint));
      this._closeEditor();
    });
    this._pointEditorComponent.setDeleteHandler(() => {
      this._pointsModel.deletePoint(this._point);

      this.destroy();
    });


    if (oldPoint === undefined || oldEditor === undefined) {
      if (this._mode === MODE.DEFAULT) {

        render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);
        return;
      }
      if (this._mode === MODE.ADD) {
        render(this._container, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
        document.addEventListener(`keydown`, this._closeEditorByEsc);

        return;
      }
    }

    if (this._mode === MODE.EDITING) {
      replace(this._pointEditorComponent, oldPoint);
    }

    if (this._mode === MODE.DEFAULT) {
      replace(this._pointComponent, oldPoint);
    }
  }

  _closeEditor() {
    document.removeEventListener(`keydown`, this.closeEditorByEsc);

    replace(this._pointComponent, this._pointEditorComponent);
    this._mode = MODE.DEFAULT;
  }

  _closeEditorByEsc(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      if (this._mode === MODE.ADD) {
        this._pointsModel.deletePoint(this._point);

        return;
      }
      this._closeEditor();
    }
  }

  resetView() {
    if (this._mode === MODE.EDITING) {
      this._closeEditor();
    }
  }

  getPointData() {
    return this._point;
  }

  destroy() {
    this._pointComponent.getElement().remove();
    this._pointEditorComponent.getElement().remove();
    this._pointComponent.removeElement(); // ?
    // this._pointComponent = {}; // ?
    this._pointEditorComponent.removeElement(); // ?
  }
}
