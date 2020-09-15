/* eslint-disable camelcase */
import {mixObserver} from '../abstract/observer.js';
import {mixAdapter} from '../abstract/fetch-adapter.js';
import SimpleCollection from '../abstract/simple-collection.js';
import {updateItem as updateItemById, addItem as addItemById, deleteItem as deleteItemById} from '../utils/collection.js';
import Offers from './offers.js';
import Destinations from './destinations.js';

export default class Points extends mixAdapter(mixObserver(SimpleCollection)) {
  constructor() {
    super();
  }

  setItems(updateType, items) {
    super.setItems(items);

    this._notify(updateType);
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

  static adaptToClient(point) {
    const {id, type, base_price, date_from, date_to, destination, is_favorite, offers = []} = point;

    return {
      id,
      type,
      basePrice: base_price,
      startDate: new Date(date_from),
      endDate: new Date(date_to),
      offers: offers.map((singleOffer) => Offers.adaptToClient(singleOffer)),
      destination: Destinations.adaptToClient(destination),
      isFavorite: is_favorite,
    };
  }

  static adaptToServer(point) {
    const {id, type, basePrice, startDate, endDate, destination, isFavorite, offers} = point;

    return {
      id,
      type,
      base_price: basePrice,
      date_from: startDate.toISOString(),
      date_to: endDate.toISOString(),
      offers: offers.map((singleOffer) => Offers.adaptToServer(singleOffer)),
      destination: Destinations.adaptToServer(destination),
      is_favorite: isFavorite,
    };
  }
}
