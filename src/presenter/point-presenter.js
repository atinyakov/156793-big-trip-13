import Point from "../view/point";
import Editor from "../view/editor";

import {Mode, UpdateType} from '../mock/constants';
import {render, RenderPosition, replace} from '../helpers/utils';

export default class PointPresenter {
  constructor(container, pointsModel, resetPoints, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._resetPoints = resetPoints;
    this._filterModel = filterModel;
    this._mode = Mode.EDITING;
    this._editorCloseHandler = this._editorCloseHandler.bind(this);
    this._editorCloseByEscHandler = this._editorCloseByEscHandler.bind(this);
    this.getPointData = this.getPointData.bind(this);
  }

  init(point, mode = this._mode) {
    this._mode = mode;
    this._point = point;

    const oldPoint = this._pointComponent;
    const oldEditor = this._pointEditorComponent;

    const destinations = this._pointsModel.getData(`destinations`);
    const offers = this._pointsModel.getData(`offers`);

    this._pointComponent = new Point(point, offers, destinations);
    this._pointEditorComponent = new Editor(point, mode, offers, destinations);

    this._pointComponent.setRollupHandler(() => {
      this._resetPoints();

      replace(this._pointEditorComponent, this._pointComponent);
      document.addEventListener(`keydown`, this._editorCloseByEscHandler);
      this._mode = Mode.EDITING;
    });

    this._pointComponent.setFavoriteHandler((pointData) => {
      this._pointsModel.updatePoint(UpdateType.PATCH, Object.assign({}, pointData, {isFavorite: !this._point.isFavorite}));
    });

    this._pointEditorComponent.setClickHandler(() => {
      document.removeEventListener(`keydown`, this.closeEditorByEsc);

      if (this._mode === Mode.ADD) {
        this._pointsModel.updatePoint(UpdateType.MAJOR, this._point);
        return;
      }

      if (this._point.hasError) {
        this._pointsModel.setPoints(this._pointsModel.getPoints(
            this._filterModel.getFilter()), true);
        return;
      }

      this._editorCloseHandler();
    });

    this._pointEditorComponent.setSubmitHandler((data) => {
      if (this._mode === Mode.ADD) {
        this._pointsModel.addPoint(data);
      }

      if (this._mode === Mode.EDITING) {
        this._pointsModel.updatePoint(UpdateType.MAJOR, data);
      }
    });

    this._pointEditorComponent.setDeleteHandler(() => {
      this._pointsModel.deletePoint(this._point);
    });


    if (oldPoint === undefined || oldEditor === undefined) {
      if (this._mode === Mode.DEFAULT) {
        render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);

        return;
      }

      if (this._mode === Mode.ADD) {
        render(this._container, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
        document.addEventListener(`keydown`, this._editorCloseByEscHandler);

        return;
      }
    }

    if (oldPoint === undefined && oldEditor !== undefined) {
      replace(this._pointEditorComponent, oldEditor);

      return;
    }

    if (this._mode !== Mode.DEFAULT) {
      if (oldPoint.parentElement === undefined) {
        replace(this._pointEditorComponent, oldEditor);
        return;
      }
      replace(this._pointEditorComponent, oldPoint);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, oldPoint);
    }
  }

  _editorCloseHandler() {
    document.removeEventListener(`keydown`, this.closeEditorByEsc);

    replace(this._pointComponent, this._pointEditorComponent);
    this._mode = Mode.DEFAULT;
  }

  _editorCloseByEscHandler(e) {
    if ((e.key === `Escape` || e.key === `Esc`) && this._mode !== Mode.DEFAULT) {
      this._editorCloseHandler();
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._editorCloseHandler();
    }
  }

  getPointData() {
    return this._point;
  }

  destroy() {
    this._pointComponent.getElement().remove();
    this._pointEditorComponent.getElement().remove();
    this._pointComponent.removeElement();
    this._pointEditorComponent.removeElement();
  }
}
