import Point from "../view/point";
import Editor from "../view/editor";
import {render, RenderPosition, replace} from '../helpers/utils';


export default class PointPresenter {
  constructor(container) {
    this._container = container;
    this._closeEditor = this._closeEditor.bind(this);
    this._closeEditorByEsc = this._closeEditorByEsc.bind(this);
  }

  init(point, index) {
    this._point = point;
    this._pointIdx = index;
    this._pointComponent = new Point(point);
    this._pointEditorComponent = new Editor(point, index, `edit`);

    this._pointComponent.setClickHandler(() => {
      replace(this._container, this._pointEditorComponent, this._pointComponent);

      document.addEventListener(`keydown`, this._closeEditorByEsc);
    });

    this._pointEditorComponent.setClickHandler(this._closeEditor);
    this._pointEditorComponent.setSubmitHandler(this._closeEditor);
    this._pointEditorComponent.setResetHandler(this._closeEditor);

    render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);

  }

  _closeEditor() {
    replace(this._container, this._pointComponent, this._pointEditorComponent);
    document.removeEventListener(`keydown`, this.closeEditorByEsc);
  }

  _closeEditorByEsc(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      this._closeEditor();
    }
  }

}
