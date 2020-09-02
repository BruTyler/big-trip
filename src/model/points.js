import {ObserverDecorator as Observable} from '../abstract/observer.js';
import SimpleCollection from '../abstract/simple-collection.js';
import {updateItem as updateItemById, addItem as addItemById, deleteItem as deleteItemById} from '../utils/collection.js';

// eslint-disable-next-line new-cap
export default class Points extends Observable(SimpleCollection) {
  constructor() {
    super();
  }

  updateItem(updateType, selectedItem) {
    this._items = updateItemById(this._items, selectedItem);
    this._notify(updateType, selectedItem);
  }

  addItem(updateType, selectedItem) {
    this._items = addItemById(this._items, selectedItem);
    this._notify(updateType, selectedItem);
  }

  deleteItem(updateType, selectedItem) {
    this._items = deleteItemById(this._items, selectedItem);
    this._notify(updateType);
  }
}
