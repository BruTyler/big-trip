import StoreFactory from './model/store-factory.js';
import SummaryPresenter from './presenter/summary.js';
import MenuPresenter from './presenter/menu.js';
import TripPresenter from './presenter/trip.js';
import {generateEvent} from './mocks/event.js';
import {generateDestinations} from './mocks/destinations.js';
import {generateOffers} from './mocks/offers.js';
import {render} from './utils/render.js';
import StatsView from './view/stats.js';
import {ModelType, RenderPosition} from './const.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const modelStore = StoreFactory.create(tripEvents, tripOffers, destinations);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const statsElement = siteMainElement.querySelector(`.page-body__container`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const tripPresenter = new TripPresenter(tripEventsElement, modelStore);

summaryPresenter.init();
menuPresenter.init();
// tripPresenter.init();

const points = modelStore.get(ModelType.POINTS).getItems();
render(statsElement, new StatsView(points), RenderPosition.BEFORE_END);
