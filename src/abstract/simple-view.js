import {createElement} from '../utils/render.js';

export default class SimpleView {
  constructor() {
    if (new.target === SimpleView) {
      throw new Error(`Can't instantiate SimpleView abstract, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
