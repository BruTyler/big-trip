import FilterPresenter from '../presenter/filter.js';
import TripTabsView from '../view/trip-tabs.js';
import EventAddButtonView from '../view/event-add-button.js';
import {render} from '../utils/render.js';
import {UpdateType, RenderPosition, ModelType} from '../const.js';

export default class Menu {
  constructor(menuContainer, modelStore) {
    this._menuContainer = menuContainer;
    this._pointNewModel = modelStore.get(ModelType.POINT_NEW);

    const tripMenuElement = this._menuContainer.querySelector(`.trip-controls`);
    const menuComponent = new TripTabsView();
    render(tripMenuElement, menuComponent, RenderPosition.BEFOREEND);

    this._buttonAddComponent = new EventAddButtonView();

    render(this._menuContainer, this._buttonAddComponent, RenderPosition.BEFOREEND);

    const filterPresenter = new FilterPresenter(tripMenuElement, modelStore);
    filterPresenter.init();

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointNewModel.addObserver(this._handleModelEvent);

    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._pointNewModel.setItem(UpdateType.MAJOR, evt.target);
    });
  }

  init() {
  }

  _handleModelEvent(_event, payload) {
    const isPointNewActive = payload !== null;
    this._buttonAddComponent.setDisabledButton(isPointNewActive);
  }
}
