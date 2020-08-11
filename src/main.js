import TripSummaryView from './view/trip-summary.js';
import TripPathView from './view/trip-path.js';
import TripCostView from './view/trip-cost.js';
import TripTabsView from './view/trip-tabs.js';
import EventFilterView from './view/event-filter.js';
import EventAddButtonView from './view/event-add-button.js';
import EventSorterView from './view/event-sorter.js';
import EventEditorView from './view/event-editor.js';
import EventDayView from './view/event-day.js';
import {generateEvent} from '../mocks/event.js';
import {generateDestinations} from '../mocks/destinations.js';
import {generateOffers} from '../mocks/offers.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from './utils/trip.js';
import {SortType, FilterType, RenderPosition} from './const.js';
import {renderTemplate} from './utils/render.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
renderTemplate(tripMainElement, new TripSummaryView().getTemplate(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
renderTemplate(tripInfoElement, new TripPathView(tripEvents).getTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripInfoElement, new TripCostView(tripEvents).getTemplate(), RenderPosition.BEFOREEND);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
renderTemplate(tripMenuElement, new TripTabsView().getTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripMenuElement, new EventFilterView().getTemplate(), RenderPosition.BEFOREEND);

renderTemplate(tripMainElement, new EventAddButtonView().getTemplate(), RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
renderTemplate(tripEventsElement, new EventSorterView().getTemplate(), RenderPosition.BEFOREEND);

const sortedTripEvents = tripEvents
  .filter(getFilterRule(FilterType.EVERYTHING))
  .sort(getSorterRule(SortType.EVENT));

renderTemplate(tripEventsElement, new EventEditorView(sortedTripEvents[0], destinations, tripOffers).getTemplate(), RenderPosition.BEFOREEND);

const groupedEvents = splitEventsByDays(sortedTripEvents);

Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
  const eventDay = new Date(shortDay);
  const dayId = dayIndex + 1;
  renderTemplate(tripEventsElement, new EventDayView(dayId, eventDay, groupedEvents[shortDay]).getTemplate(), RenderPosition.BEFOREEND);
});
