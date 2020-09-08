import StoreFactory from './model/store-factory.js';
import Api from './api.js';
import SummaryPresenter from './presenter/summary.js';
import MenuPresenter from './presenter/menu.js';
import TripPresenter from './presenter/trip.js';
import StatsPresenter from './presenter/stats.js';
import {generateEvent} from './mocks/event.js';
import {generateDestinations} from './mocks/destinations.js';
import {generateOffers} from './mocks/offers.js';
import {ModelType} from './const.js';

const TRIP_EVENT_COUNT = 20;
const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));
const api = new Api(END_POINT, AUTHORIZATION);

const modelStore = StoreFactory.create();
modelStore.get(ModelType.DESTINATIONS).setItems(destinations);
modelStore.get(ModelType.OFFERS).setItems(tripOffers);
modelStore.get(ModelType.POINTS).setItems(tripEvents);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const statsElement = siteMainElement.querySelector(`.page-body__container`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const tripPresenter = new TripPresenter(tripEventsElement, modelStore);
const statsPresenter = new StatsPresenter(statsElement, modelStore);

summaryPresenter.init();
menuPresenter.init();
tripPresenter.init();
statsPresenter.init();

api.getPoints()
  .then((points) => {
    console.log(points);
  })
  .catch(() => {
    console.log(`error`);
  });

api.getOffers()
  .then((offers) => {
    console.log(offers);
  })
  .catch(() => {
    console.log(`error`);
  });

api.getDestinations()
  .then((fetchedDestinations) => {
    console.log(fetchedDestinations);
  })
  .catch(() => {
    console.log(`error`);
  });
