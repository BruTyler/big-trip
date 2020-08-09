import {createTripSummaryTemplate} from './view/trip-summary.js';
import {createTripPathTemplate} from './view/trip-path.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createTripTabsTemplate} from './view/trip-tabs.js';
import {createEventFilterTemplate} from './view/event-filter.js';
import {createEventSorterTemplate} from './view/event-sorter.js';
import {createEventEditorTemplate} from './view/event-editor.js';
import {createEventDayTemplate} from './view/event-day.js';
import {generateEvent} from '../mocks/event.js';
import {generateDestinations} from '../mocks/destinations.js';
import {generateOffers} from '../mocks/offers.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from './utils/trip.js';
import {SortType, FilterType} from './const.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
render(tripMainElement, createTripSummaryTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripPathTemplate(tripEvents), `beforeend`);
render(tripInfoElement, createTripCostTemplate(tripEvents), `beforeend`);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
render(tripMenuElement, createTripTabsTemplate(), `beforeend`);
render(tripMenuElement, createEventFilterTemplate(), `beforeend`);

const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
render(tripEventsElement, createEventSorterTemplate(), `beforeend`);

const sortedTripEvents = tripEvents
  .filter(getFilterRule(FilterType.EVERYTHING))
  .sort(getSorterRule(SortType.EVENT));

render(tripEventsElement, createEventEditorTemplate(sortedTripEvents[0], destinations, tripOffers), `beforeend`);

const groupedEvents = splitEventsByDays(sortedTripEvents);

Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
  const eventDay = new Date(shortDay);
  const dayId = dayIndex + 1;
  render(tripEventsElement, createEventDayTemplate(dayId, eventDay, groupedEvents[shortDay]), `beforeend`);
});
