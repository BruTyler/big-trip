import SimpleCollection from '../abstract/simple-collection.js';
import {mixAdapter} from '../abstract/fetch-adapter.js';

export default class Offers extends mixAdapter(SimpleCollection) {
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
