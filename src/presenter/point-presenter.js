import Point from "../view/point";
import Editor from "../view/editor";

import {MODE, UPDATE_TYPE} from '../mock/constants';
import {render, RenderPosition, replace} from '../helpers/utils';


export default class PointPresenter {
  constructor(container, pointsModel, resetPoints, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._resetPoints = resetPoints;
    this._filterModel = filterModel;
    this._mode = MODE.EDITING;
    this._closeEditor = this._closeEditor.bind(this);
    this._closeEditorByEsc = this._closeEditorByEsc.bind(this);
    this.getPointData = this.getPointData.bind(this);
  }

  init(point, mode = this._mode) {
    this._point = point;
    this._mode = mode;

    const oldPoint = this._pointComponent;
    const oldEditor = this._pointEditorComponent;

    this._pointComponent = new Point(point, this._pointsModel.getData(`offers`));
    this._pointEditorComponent = new Editor(point, mode, this._pointsModel.getData(`offers`), this._pointsModel.getData(`destinations`));

    this._pointComponent.setRollupHandler(() => {
      this._resetPoints();

      replace(this._pointEditorComponent, this._pointComponent);
      document.addEventListener(`keydown`, this._closeEditorByEsc);
      this._mode = MODE.EDITING;
    });

    this._pointComponent.setFavoriteHandler(() => {
      this._pointsModel.updatePoint(UPDATE_TYPE.PATCH, Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
    });

    this._pointEditorComponent.setClickHandler(() => {
      document.removeEventListener(`keydown`, this.closeEditorByEsc);

      if (this._mode === MODE.ADD) {
        this._pointsModel.updatePoint(UPDATE_TYPE.MAJOR, this._point);
        return;
      }

      if (this._point.hasError) {
        this._pointsModel.setPoints(this._pointsModel.getPoints(
            this._filterModel.getFilter()), true);
        return;
      }

      this._closeEditor();
    });

    this._pointEditorComponent.setSubmitHandler((data) => {
      if (this._mode === MODE.ADD) {
        this._pointsModel.addPoint(data);
      }

      if (this._mode === MODE.EDITING) {
        this._pointsModel.updatePoint(UPDATE_TYPE.MAJOR, data);
      }
    });

    this._pointEditorComponent.setDeleteHandler(() => {
      this._pointsModel.deletePoint(this._point);
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

    if (oldPoint === undefined && oldEditor !== undefined) {
      replace(this._pointEditorComponent, oldEditor);

      return;
    }

    if (this._mode !== MODE.DEFAULT) {
      if (oldPoint.parentElement === undefined) {
        replace(this._pointEditorComponent, oldEditor);
        return;
      }
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
    if ((e.key === `Escape` || e.key === `Esc`) && this._mode !== MODE.DEFAULT) {
      this._closeEditor();
    }
  }

  resetView() {
    if (this._mode !== MODE.DEFAULT) {
      this._closeEditor();
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
