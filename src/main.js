import TripSummaryView from './view/trip-summary.js';
import TripPathView from './view/trip-path.js';
import TripCostView from './view/trip-cost.js';
import TripTabsView from './view/trip-tabs.js';
import EventFilterView from './view/event-filter.js';
import EventAddButtonView from './view/event-add-button.js';
import EventSorterView from './view/event-sorter.js';
import EventEditorView from './view/event-editor.js';
import EventDayView from './view/event-day.js';
import EventPointView from './view/event-point.js';
import NoPointsView from './view/no-points.js';
import {generateEvent} from '../mocks/event.js';
import {generateDestinations} from '../mocks/destinations.js';
import {generateOffers} from '../mocks/offers.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from './utils/trip.js';
import {SortType, FilterType, RenderPosition} from './const.js';
import {render, replace} from './utils/render.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const renderSinglePoint = (pointContainer, tripEvent) => {
  const eventPointComponent = new EventPointView(tripEvent);
  const eventEditorComponent = new EventEditorView(tripEvent, destinations, tripOffers);

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
};

const renderChainPoints = (chainContainer, chainEvents) => {
  if (chainEvents.length === 0) {
    render(chainContainer, new NoPointsView(), RenderPosition.BEFOREEND);
    return;
  }

  render(chainContainer, new EventSorterView(), RenderPosition.BEFOREEND);

  const sortedTripEvents = chainEvents
    .filter(getFilterRule(FilterType.EVERYTHING))
    .sort(getSorterRule(SortType.EVENT));

  const groupedEvents = splitEventsByDays(sortedTripEvents);

  Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
    const eventDay = new Date(shortDay);
    const dayId = dayIndex + 1;
    const EventDayComponent = new EventDayView(dayId, eventDay);
    render(chainContainer, EventDayComponent, RenderPosition.BEFOREEND);

    groupedEvents[shortDay].forEach((tripEvent) => {
      const pointContainer = EventDayComponent.getPointContainer();
      renderSinglePoint(pointContainer, tripEvent);
    });
  });
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripSummaryComponent = new TripSummaryView();
render(tripMainElement, tripSummaryComponent, RenderPosition.AFTERBEGIN);

render(tripSummaryComponent, new TripPathView(tripEvents), RenderPosition.BEFOREEND);
render(tripSummaryComponent, new TripCostView(tripEvents), RenderPosition.BEFOREEND);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
render(tripMenuElement, new TripTabsView(), RenderPosition.BEFOREEND);
render(tripMenuElement, new EventFilterView(), RenderPosition.BEFOREEND);
render(tripMainElement, new EventAddButtonView(), RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
renderChainPoints(tripEventsElement, tripEvents);
