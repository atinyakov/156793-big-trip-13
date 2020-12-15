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

    // как это работает???
    this._restoreHandlers();
  }


  _updateData(update) {
    if (!update) {
      return;
    }
    // как это работает???
    this._data[0] = Object.assign({}, this._data[0], update);

    this._updateElement();
  }

}
