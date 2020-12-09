import Point from "../view/point";
import Editor from "../view/editor";
import {render, RenderPosition, replace} from '../helpers/utils';
export default class PointPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
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
      replace(this._pointEditorComponent, this._pointComponent);

      document.addEventListener(`keydown`, this._closeEditorByEsc);
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

    replace(this._pointComponent, oldPoint);
  }

  _closeEditor() {
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener(`keydown`, this.closeEditorByEsc);
  }

  _closeEditorByEsc(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      this._closeEditor();
    }
  }

}
