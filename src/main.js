import TripSummaryView from './view/trip-summary.js';
import TripPathView from './view/trip-path.js';
import TripCostView from './view/trip-cost.js';
import TripTabsView from './view/trip-tabs.js';
import EventFilterView from './view/event-filter.js';
import EventAddButtonView from './view/event-add-button.js';
import TripPresenter from './presenter/trip.js';
import {generateEvent} from '../mocks/event.js';
import {generateDestinations} from '../mocks/destinations.js';
import {generateOffers} from '../mocks/offers.js';
import {render} from './utils/render.js';
import {RenderPosition} from './const.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

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

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(tripEvents, destinations, tripOffers);
