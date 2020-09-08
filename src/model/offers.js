import SimpleCollection from '../abstract/simple-collection.js';
import {AdapterDecorator as Fetchable} from '../abstract/fetch-adapter.js';

// eslint-disable-next-line new-cap
export default class Offers extends Fetchable(SimpleCollection) {
  constructor() {
    super();
  }

  static adaptToClient(offer) {
    return offer;
  }

  static adaptToServer(offer) {
    return offer;
  }
}
