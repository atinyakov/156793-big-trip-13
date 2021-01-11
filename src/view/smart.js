import Abstract from './abstract';
import {replace} from '../helpers/utils';


export default class Smart extends Abstract {
  _updateElement() {
    const oldEl = this.getElement();
    this.removeElement();

    const newEl = this.getElement();

    replace(newEl, oldEl);
  }


  _updateData(update, justData = false) {
    if (!update) {
      return;
    }

    if (Array.isArray(this._data)) {
      this._data = update;
    } else {
      this._data = Object.assign({}, this._data, update);
    }


    if (justData) {
      return;
    }
    this._updateElement();
  }

}
