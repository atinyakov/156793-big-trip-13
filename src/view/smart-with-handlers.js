import Smart from './smart';

export default class SmartWithHandlers extends Smart {
  restoreHandlers() {
    throw new Error(`You should implement method on instance`);
  }

  _updateElement() {
    super._updateElement();

    this.restoreHandlers();
  }
}
