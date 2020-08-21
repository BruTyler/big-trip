import PointPresenter from './point.js';
import EventSorterView from '../view/event-sorter.js';
import EventDayView from '../view/event-day.js';
import NoPointsView from '../view/no-points.js';
import {getSorterRule, getFilterRule, groupEvents, convertToNullableDate} from '../utils/trip.js';
import {FilterType, RenderPosition, DefaultValues} from '../const.js';
import {render, remove} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currenSortType = DefaultValues.SORT_TYPE;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);

    this._eventSorterComponent = new EventSorterView(this._currenSortType);
    this._noPointsComponent = new NoPointsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripEvents, destinations, tripOffers) {
    this._tripEvents = tripEvents.filter(getFilterRule(FilterType.EVERYTHING));
    this._destinations = destinations;
    this._tripOffers = tripOffers;

    this._renderTripBoard();
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._clearChainPoints();

    this._currenSortType = sortType;
    const sortedTripEvents = this._tripEvents.sort(getSorterRule(this._currenSortType));
    this._renderChainPoints(sortedTripEvents);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
    this._eventSorterComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer);
    point.init(tripEvent, this._destinations, this._tripOffers);
    this._pointStorage[tripEvent.id] = point;
  }

  _renderChainPoints(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currenSortType, sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, groupIndex) => {
      const groupedDate = convertToNullableDate(shortDay);
      const dayId = groupIndex + 1;
      const EventDayComponent = new EventDayView(dayId, groupedDate);
      this._dayStorage[dayId] = EventDayComponent;
      render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);

      groupedEvents[shortDay].forEach((tripEvent) => {
        const pointContainer = EventDayComponent.getPointContainer();
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
    if (this._tripEvents.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    const sortedTripEvents = this._tripEvents.sort(getSorterRule(this._currenSortType));
    this._renderChainPoints(sortedTripEvents);
  }
}
