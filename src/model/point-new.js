import {mixObserver} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';

export default class PointNew extends mixObserver(ActiveItem) {
  constructor() {
    super();
  }
}
