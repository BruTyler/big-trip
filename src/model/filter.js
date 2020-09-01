import Observer from '../abstract/observer.js';
import {DefaultValues} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = DefaultValues.FILTER_TYPE;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
