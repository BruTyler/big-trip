import EventSorterView from '../view/event-sorter.js';
import EventEditorView from '../view/event-editor.js';
import EventDayView from '../view/event-day.js';
import EventPointView from '../view/event-point.js';
import NoPointsView from '../view/no-points.js';
import {getSorterRule, getFilterRule, groupEvents, convertToNullableDate} from '../utils/trip.js';
import {FilterType, RenderPosition, DefaultValues} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currenSortType = DefaultValues.SORT_TYPE;
    this._tripDays = [];

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
    const eventPointComponent = new EventPointView(tripEvent);
    const eventEditorComponent = new EventEditorView(tripEvent, this._destinations, this._tripOffers);

    const replacePointToForm = () => {
      replace(eventEditorComponent, eventPointComponent);
    };

    const replaceFormToPoint = () => {
      replace(eventPointComponent, eventEditorComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventPointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditorComponent.setCancelClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEditorComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(pointContainer, eventPointComponent, RenderPosition.BEFOREEND);
  }

  _renderChainPoints(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currenSortType, sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
      const groupedDate = convertToNullableDate(shortDay);
      const dayId = dayIndex + 1;
      const EventDayComponent = new EventDayView(dayId, groupedDate);
      this._tripDays.push(EventDayComponent);
      render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);

      groupedEvents[shortDay].forEach((tripEvent) => {
        const pointContainer = EventDayComponent.getPointContainer();
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    });

  }

  _clearChainPoints() {
    this._tripDays.forEach((day) => remove(day));
    this._tripDays = [];
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
