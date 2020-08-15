import EventSorterView from '../view/event-sorter.js';
import EventEditorView from '../view/event-editor.js';
import EventDayView from '../view/event-day.js';
import EventPointView from '../view/event-point.js';
import NoPointsView from '../view/no-points.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from '../utils/trip.js';
import {SortType, FilterType, RenderPosition} from '../const.js';
import {render, replace} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._eventSorterComponent = new EventSorterView();
    this._noPointsComponent = new NoPointsView();
  }

  init(tripEvents, destinations, tripOffers) {
    this._tripEvents = tripEvents.slice();
    this._destinations = destinations;
    this._tripOffers = tripOffers;

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
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
    const groupedEvents = splitEventsByDays(sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
      const eventDay = new Date(shortDay);
      const dayId = dayIndex + 1;
      const EventDayComponent = new EventDayView(dayId, eventDay);
      render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);

      groupedEvents[shortDay].forEach((tripEvent) => {
        const pointContainer = EventDayComponent.getPointContainer();
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    });
  }

  _renderTripBoard() {
    if (this._tripEvents.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    const sortedTripEvents = this._tripEvents
      .filter(getFilterRule(FilterType.EVERYTHING))
      .sort(getSorterRule(SortType.EVENT));

    this._renderChainPoints(sortedTripEvents);
  }
}
