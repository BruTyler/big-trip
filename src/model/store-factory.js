import Store from './store.js';
import Menu from './menu.js';
import Points from './points.js';
import Filter from './filter.js';
import Offers from './offers.js';
import Destinations from './destinations.js';
import PointNew from './point-new.js';

export default class StoreFactory {
  static create() {
    const modelStore = new Store();

    const menuModel = new Menu();
    modelStore.set(menuModel);

    const destinationsModel = new Destinations();
    modelStore.set(destinationsModel);

    const offersModel = new Offers();
    modelStore.set(offersModel);

    const pointsModel = new Points();
    modelStore.set(pointsModel);

    const pointNew = new PointNew();
    modelStore.set(pointNew);

    const filterModel = new Filter();
    modelStore.set(filterModel);

    return modelStore;
  }
}
