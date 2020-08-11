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
import {generateEvent} from '../mocks/event.js';
import {generateDestinations} from '../mocks/destinations.js';
import {generateOffers} from '../mocks/offers.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from './utils/trip.js';
import {SortType, FilterType, RenderPosition} from './const.js';
import {render} from './utils/render.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const renderPoint = (dayContainer, tripEvent) => {
  const pointContainer = dayContainer.querySelector(`.trip-events__list`);

  const eventPointComponent = new EventPointView(tripEvent);
  const eventEditorComponent = new EventEditorView(tripEvent, destinations, tripOffers);

  const replacePointToForm = () => {
    pointContainer.replaceChild(eventEditorComponent.getElement(), eventPointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointContainer.replaceChild(eventPointComponent.getElement(), eventEditorComponent.getElement());
  };

  eventPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
  });

  eventEditorComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToPoint();
  });

  eventEditorComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(pointContainer, eventPointComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripSummaryComponent = new TripSummaryView();
render(tripMainElement, tripSummaryComponent.getElement(), RenderPosition.AFTERBEGIN);

render(tripSummaryComponent.getElement(), new TripPathView(tripEvents).getElement(), RenderPosition.BEFOREEND);
render(tripSummaryComponent.getElement(), new TripCostView(tripEvents).getElement(), RenderPosition.BEFOREEND);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
render(tripMenuElement, new TripTabsView().getElement(), RenderPosition.BEFOREEND);
render(tripMenuElement, new EventFilterView().getElement(), RenderPosition.BEFOREEND);
render(tripMainElement, new EventAddButtonView().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
render(tripEventsElement, new EventSorterView().getElement(), RenderPosition.BEFOREEND);

const sortedTripEvents = tripEvents
  .filter(getFilterRule(FilterType.EVERYTHING))
  .sort(getSorterRule(SortType.EVENT));

const groupedEvents = splitEventsByDays(sortedTripEvents);

Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
  const eventDay = new Date(shortDay);
  const dayId = dayIndex + 1;
  const EventDayComponent = new EventDayView(dayId, eventDay);
  render(tripEventsElement, EventDayComponent.getElement(), RenderPosition.BEFOREEND);

  groupedEvents[shortDay].forEach((tripEvent) => {
    renderPoint(EventDayComponent.getElement(), tripEvent);
  });
});
