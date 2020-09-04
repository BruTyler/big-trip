import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import TripTabsView from './view/trip-tabs.js';
import EventAddButtonView from './view/event-add-button.js';
import {generateEvent} from './mocks/event.js';
import {generateDestinations} from './mocks/destinations.js';
import {generateOffers} from './mocks/offers.js';
import {render} from './utils/render.js';
import {RenderPosition} from './const.js';
import StoreFactory from './model/store-factory.js';
import SummaryPresenter from './presenter/summary.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const modelStore = StoreFactory.createStore(tripEvents, tripOffers, destinations);

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
const menuComponent = new TripTabsView();
render(tripMenuElement, menuComponent, RenderPosition.BEFOREEND);

const addButtonComponent = new EventAddButtonView();

render(tripMainElement, addButtonComponent, RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const filterPresenter = new FilterPresenter(tripMenuElement, modelStore);
const tripPresenter = new TripPresenter(tripEventsElement, modelStore);

summaryPresenter.init();
filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

