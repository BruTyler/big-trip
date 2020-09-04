import SmartView from '../abstract/smart-view.js';
import {TabNavItem, DefaultValues} from '../const.js';
import {capitilizeFirstLetter} from '../utils/common.js';

const createNavTemplate = (currentTab) => {
  return Object
    .values(TabNavItem)
    .map((tab) => (
      `<a href="#"
        class="trip-tabs__btn  ${currentTab === tab ? `trip-tabs__btn--active` : ``}"
        value="${tab}"
      >
        ${capitilizeFirstLetter(tab)}
      </a>`))
    .join(``);
};

const createTripTabsTemplate = (currentTab) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${createNavTemplate(currentTab)}
    </nav>`
  );
};

export default class TripTabs extends SmartView {
  constructor() {
    super();
    this._currentTab = DefaultValues.MAIN_NAV;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  restoreHandlers() {

  }

  getTemplate() {
    return createTripTabsTemplate(this._currentTab);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }
}
