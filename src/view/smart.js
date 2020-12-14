import Abstract from './abstract';
import {replace} from '../helpers/utils';


export default class Smart extends Abstract {
  constructor(restoreHandlersCb) {
    super();

    this.restoreHandlers = restoreHandlersCb;
  }

  restoreHandlers() {
    throw new Error(`You should implement method on instance`);
  }

  updateElement() {
    const oldEl = super.getElement();
    super.removeElement();

    const newEl = super.getElement();

    replace(newEl, oldEl);
  }

  updateData() {

  }

}
