import SimpleView from './simple-view.js';
import {extend} from '../utils/common.js';

export default class SmartView extends SimpleView {
  constructor() {
    super();
    this._item = Object.create(null);
  }

  updateData(updatedData, justDataUpdating) {
    if (!updatedData) {
      return;
    }

    this._item = extend(this._item, updatedData);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
