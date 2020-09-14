import SimpleCollection from '../abstract/simple-collection.js';
import {mixAdapter} from '../abstract/fetch-adapter.js';

export default class Destinations extends mixAdapter(SimpleCollection) {
  constructor() {
    super();
  }

  static adaptToClient(destination) {
    return destination;
  }

  static adaptToServer(destination) {
    return destination;
  }
}
