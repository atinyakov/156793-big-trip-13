import Abstract from './abstract';
import {replace} from '../helpers/utils';


export default class Smart extends Abstract {
  restoreHandlers() {
    throw new Error(`You should implement method on instance`);
  }

  _updateElement() {
    const oldEl = this.getElement();
    this.removeElement();

    const newEl = this.getElement();

    replace(newEl, oldEl);


    this.restoreHandlers();
  }


  _updateData(update, justData = false) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justData) {
      return;
    }
    this._updateElement();
  }

}
