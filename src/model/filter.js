import {mixObserver} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';
import {DefaultValues} from '../const.js';

export default class Filter extends mixObserver(ActiveItem) {
  constructor() {
    super();
    this._activeItem = DefaultValues.FILTER_TYPE;
  }
}
