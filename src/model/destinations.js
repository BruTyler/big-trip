import SimpleCollection from '../abstract/simple-collection.js';
import {AdapterDecorator as Fetchable} from '../abstract/fetch-adapter.js';

// eslint-disable-next-line new-cap
export default class Destinations extends Fetchable(SimpleCollection) {
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
