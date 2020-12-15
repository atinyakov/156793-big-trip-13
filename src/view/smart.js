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

    // В реализации этот метод перекрывается, и уже вызывается он а не тот абстрактный который тут есть
    this.restoreHandlers();
  }


  _updateData(update) {
    if (!update) {
      return;
    }
    // Зачем ты так плодишь аргументы? А так просто берет первый элемент и обновляет его через слияние в пустой объект по первому уровню, почитай что делает Object.assign
    this._data[0] = Object.assign({}, this._data[0], update);

    this._updateElement();
  }

}
