import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import EventSorterView from '../view/event-sorter.js';
import EventDayView from '../view/event-day.js';
import EventMsgView from '../view/event-msg.js';
import {getSorterRule, groupEvents, convertToNullableDate, getFilterRule} from '../utils/trip.js';
import {RenderPosition, DefaultValues, UpdateType, UserAction, FilterType, ModelType, TabNavItem, MessageText, EditState} from '../const.js';
import {render, remove} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer, modelStore, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._tripOffersModel = modelStore.get(ModelType.OFFERS);
    this._destinationsModel = modelStore.get(ModelType.DESTINATIONS);
    this._filterModel = modelStore.get(ModelType.FILTER);
    this._pointNewModel = modelStore.get(ModelType.POINT_NEW);
    this._menuModel = modelStore.get(ModelType.MENU);

    this._currenSortType = DefaultValues.SORT_TYPE;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);
    this._isLoading = true;
    this._isCrashed = false;
    this._api = api;

    this._eventSorterComponent = null;
    this._msgComponent = null;

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._menuEventHandler = this._menuEventHandler.bind(this);
    this._createPoint = this._createPoint.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._menuModel.addObserver(this._menuEventHandler);

    this._pointNewPresenter = new PointNewPresenter(this._tripEventsContainer, modelStore, this._viewActionHandler);
  }

  init() {
    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
    this._pointNewModel.addObserver(this._createPoint);

    this._renderTripBoard();
  }

  destroy() {
    this._clearTripBoard({resetSortType: true});

    this._pointsModel.removeObserver(this._modelEventHandler);
    this._filterModel.removeObserver(this._modelEventHandler);
    this._pointNewModel.removeObserver(this._createPoint);
  }

  _createPoint(_event, payload) {
    if (payload === null) {
      return;
    }

    this._modeChangeHandler();
    this._currentSortType = DefaultValues.SORT_TYPE;
    this._pointNewPresenter.init(this._destinationsModel.getItems(), this._tripOffersModel.getItems());
  }

  _getPoints() {
    const filterType = this._filterModel.getItem();

    return this._pointsModel.getItems()
      .filter(getFilterRule(filterType))
      .sort(getSorterRule(this._currenSortType));
  }

  _modeChangeHandler() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointStorage)
      .forEach((presenter) => presenter.resetView());
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updateItem(updateType, response);
          })
          .catch(() => {
            this._pointStorage[update.id].setEditState(EditState.ABORTED);
          });
        break;
      case UserAction.ADD_POINT:
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addItem(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setEditState(EditState.ABORTED);
          });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deleteItem(updateType, update);
          })
          .catch(() => {
            this._pointStorage[update.id].setEditState(EditState.ABORTED);
          });
        break;
    }
  }

  _modelEventHandler(updateType, payload) {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this._clearChainPoints();
        this._renderChainPoints(this._getPoints());
        break;
      case UpdateType.MAJOR:
        const resetSortType = Object.values(FilterType).includes(payload);
        this._clearTripBoard({resetSortType});
        this._renderTripBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._isCrashed = false;
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
      case UpdateType.CRASH:
        this._isLoading = false;
        this._isCrashed = true;
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _menuEventHandler(_updateType, menuItem) {
    switch (menuItem) {
      case TabNavItem.TABLE:
        this._renderTripBoard();
        break;
      case TabNavItem.STATS:
        this._clearTripBoard({resetSortType: true});
        break;
      default:
        break;
    }
  }

  _sortTypeChangeHandler(sortType) {
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
    this._eventSorterComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFORE_END);
  }

  _renderMsg(msgText) {
    if (this._msgComponent !== null) {
      this._msgComponent = null;
    }

    this._msgComponent = new EventMsgView(msgText);
    render(this._tripEventsContainer, this._msgComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer, this._viewActionHandler, this._modeChangeHandler);
    point.init(tripEvent, this._destinationsModel.getItems(), this._tripOffersModel.getItems());
    this._pointStorage[tripEvent.id] = point;
  }

  _renderChainPoints(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currenSortType, sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, groupIndex) => {
      const groupedDate = convertToNullableDate(shortDay);
      const dayId = groupIndex + 1;
      const eventDayComponent = new EventDayView(dayId, groupedDate);
      this._dayStorage[dayId] = eventDayComponent;
      render(this._tripEventsContainer, eventDayComponent, RenderPosition.BEFORE_END);

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
    if (this._isLoading) {
      this._renderMsg(MessageText.LOADING);
      return;
    }

    if (this._isCrashed) {
      this._renderMsg(MessageText.CRASH);
      return;
    }

    if (this._getPoints().length === 0) {
      this._renderMsg(MessageText.NO_POINTS);
      return;
    }

    this._renderSort();
    this._renderChainPoints(this._getPoints());
  }

  _clearTripBoard({resetSortType} = {}) {
    if (resetSortType) {
      this._currenSortType = DefaultValues.SORT_TYPE;
    }

    this._pointNewPresenter.destroy();
    this._clearChainPoints();
    remove(this._eventSorterComponent);
    remove(this._msgComponent);
  }
}
