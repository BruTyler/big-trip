import Observer from '../abstract/observer.js';

export default class Menu extends Observer {
  constructor() {
    super();

    this._activeItem = null;
  }

  setItem(updateType, selectedItem) {
    this._activeItem = selectedItem;
    this._notify(updateType, selectedItem);
  }

  getItem() {
    return this._activeFilter;
  }
}
