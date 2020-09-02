import PointPresenter from './point.js';
import EventSorterView from '../view/event-sorter.js';
import EventDayView from '../view/event-day.js';
import NoPointsView from '../view/no-points.js';
import {getSorterRule, groupEvents, convertToNullableDate} from '../utils/trip.js';
import {RenderPosition, DefaultValues, UpdateType, UserAction} from '../const.js';
import {render, remove} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer, {pointsModel, offersModel, destinationsModel} = {}) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._tripOffers = offersModel.getItems();
    this._destinations = destinationsModel.getItems();

    this._currenSortType = DefaultValues.SORT_TYPE;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);

    this._eventSorterComponent = null;
    this._noPointsComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripBoard();
  }

  _getPoints() {
    // .filter(getFilterRule(FilterType.EVERYTHING));
    return this._pointsModel.getItems()
      .sort(getSorterRule(this._currenSortType));
  }

  _handleModeChange() {
    Object
      .values(this._pointStorage)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updateItem(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addItem(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deleteItem(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this._clearChainPoints();
        this._renderChainPoints(this._getPoints());
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard();
        this._renderTripBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._clearChainPoints();
    this._currenSortType = sortType;
    this._renderChainPoints(this._getPoints());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._eventSorterComponent = new EventSorterView(this._currenSortType);
    this._eventSorterComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    if (this._noPointsComponent !== null) {
      this._noPointsComponent = null;
    }

    this._noPointsComponent = new NoPointsView();
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer, this._handleViewAction, this._handleModeChange);
    point.init(tripEvent, this._destinations, this._tripOffers);
    this._pointStorage[tripEvent.id] = point;
  }

  _renderChainPoints(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currenSortType, sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, groupIndex) => {
      const groupedDate = convertToNullableDate(shortDay);
      const dayId = groupIndex + 1;
      const eventDayComponent = new EventDayView(dayId, groupedDate);
      this._dayStorage[dayId] = eventDayComponent;
      render(this._tripEventsContainer, eventDayComponent, RenderPosition.BEFOREEND);

      groupedEvents[shortDay].forEach((tripEvent) => {
        const pointContainer = eventDayComponent.getPointContainer();
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    });
  }

  _clearChainPoints() {
    this._pointStorage = Object.create(null);

    Object
      .values(this._dayStorage)
      .forEach((day) => remove(day));

    this._dayStorage = Object.create(null);
  }

  _renderTripBoard() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderChainPoints(this._getPoints());
  }

  _clearTripBoard() {
    this._clearChainPoints();
    remove(this._noPointsComponent);
    remove(this._eventSorterComponent);
  }
}
