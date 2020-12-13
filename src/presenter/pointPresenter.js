import Point from "../view/point";
import Editor from "../view/editor";
import {render, RenderPosition, replace} from '../helpers/utils';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class PointPresenter {
  constructor(container, changeData, resetPoints) {
    this._container = container;
    this._changeData = changeData;
    this._resetPoints = resetPoints;
    this._mode = Mode.DEFAULT;
    this._closeEditor = this._closeEditor.bind(this);
    this._closeEditorByEsc = this._closeEditorByEsc.bind(this);
  }

  init(point, index) {
    this._point = point;
    this._pointIdx = index;


    const oldPoint = this._pointComponent;
    const oldEditor = this._pointEditorComponent;

    this._pointComponent = new Point(point);
    this._pointEditorComponent = new Editor(point, index, `edit`);

    this._pointComponent.setRollupHandler(() => {

      document.addEventListener(`keydown`, this._closeEditorByEsc);

      this._resetPoints();

      replace(this._pointEditorComponent, this._pointComponent);
      this._mode = Mode.EDITING;
    });

    this._pointComponent.setFavoriteHandler(() => {
      this._changeData(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}), this._pointIdx);
    });

    this._pointEditorComponent.setClickHandler(this._closeEditor);
    this._pointEditorComponent.setSubmitHandler(this._closeEditor);
    this._pointEditorComponent.setResetHandler(this._closeEditor);

    if (oldPoint === undefined || oldEditor === undefined) {

      render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);
      return;
    }


    if (this._mode === Mode.EDITING) {
      replace(this._pointEditorComponent, oldPoint);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, oldPoint);
    }

  }

  _closeEditor() {
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener(`keydown`, this.closeEditorByEsc);
    this._mode = Mode.DEFAULT;
  }

  _closeEditorByEsc(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      this._closeEditor();
    }
  }

  resetView() {
    if (this._mode === Mode.EDITING) {

      this._closeEditor();

    }
  }
}
