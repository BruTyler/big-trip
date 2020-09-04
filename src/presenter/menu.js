import FilterPresenter from '../presenter/filter.js';
import TripTabsView from '../view/trip-tabs.js';
import EventAddButtonView from '../view/event-add-button.js';
import {render} from '../utils/render.js';
import {UpdateType, RenderPosition, ModelType, MenuItem, DefaultValues} from '../const.js';

export default class Menu {
  constructor(menuContainer, modelStore) {
    this._menuContainer = menuContainer;
    this._pointNewModel = modelStore.get(ModelType.POINT_NEW);
    this._menuModel = modelStore.get(ModelType.MENU);
    this._filterModel = modelStore.get(ModelType.FILTER);

    this._controlsContainer = this._menuContainer.querySelector(`.trip-controls`);

    this._tabsComponent = null;
    this._buttonAddComponent = null;

    this._filterPresenter = new FilterPresenter(this._controlsContainer, modelStore);

    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._tabsComponent = new TripTabsView(this._menuModel.getItem());
    render(this._controlsContainer, this._tabsComponent, RenderPosition.BEFORE_END);

    this._buttonAddComponent = new EventAddButtonView();
    render(this._menuContainer, this._buttonAddComponent, RenderPosition.BEFORE_END);

    this._tabsComponent.setMenuClickHandler(this._handleMenuClick);
    this._buttonAddComponent.setButtonClickHandler(this._handleMenuClick);

    this._filterPresenter.init();
  }

  _handleModelEvent(_event, payload) {
    const isPointNewActive = payload !== null;
    this._buttonAddComponent.setDisabledButton(isPointNewActive);
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_NEW_EVENT:
        this._pointNewModel.setItem(UpdateType.MAJOR, menuItem);
        this._filterPresenter.init();
        this._setActiveNavItem(MenuItem.TABLE);
        break;
      case MenuItem.TABLE:
        this._setActiveNavItem(menuItem);
        this._filterPresenter.init();
        break;
      case MenuItem.STATS:
        this._setActiveNavItem(menuItem);
        this._filterPresenter.destroy();
        break;
    }
  }

  _setActiveNavItem(tab) {
    if (this._menuModel.getItem() === tab) {
      return;
    }

    if (this._filterModel.getItem() !== DefaultValues.FILTER_TYPE) {
      this._filterModel.setItem(UpdateType.MAJOR, DefaultValues.FILTER_TYPE);
    }

    this._menuModel.setItem(UpdateType.MAJOR, tab);
    this._tabsComponent.setActiveTab(tab);
  }
}
