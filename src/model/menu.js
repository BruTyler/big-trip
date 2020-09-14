import {mixObserver} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';
import {DefaultValues} from '../const.js';

export default class Menu extends mixObserver(ActiveItem) {
  constructor() {
    super();
    this._activeItem = DefaultValues.MAIN_NAV;
  }
}
