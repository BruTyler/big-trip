import StoreFactory from './model/store-factory.js';
import Api from './api/index.js';
import SummaryPresenter from './presenter/summary.js';
import MenuPresenter from './presenter/menu.js';
import TripPresenter from './presenter/trip.js';
import StatsPresenter from './presenter/stats.js';
import {ModelType, UpdateType} from './const.js';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const modelStore = StoreFactory.create();

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const statsElement = siteMainElement.querySelector(`.page-body__container`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const tripPresenter = new TripPresenter(tripEventsElement, modelStore, api);
const statsPresenter = new StatsPresenter(statsElement, modelStore);

summaryPresenter.init();
tripPresenter.init();
statsPresenter.init();

const fetchedDataPromises = [
  api.getDestinations(),
  api.getOffers(),
  api.getPoints()
];

Promise.all(fetchedDataPromises)
  .then(([destinations, offers, points]) => {
    modelStore.get(ModelType.DESTINATIONS).setItems(destinations);
    modelStore.get(ModelType.OFFERS).setItems(offers);
    modelStore.get(ModelType.POINTS).setItems(UpdateType.INIT, points);
    menuPresenter.init();
  })
  .catch(() => {
    modelStore.get(ModelType.POINTS).setItems(UpdateType.CRASH, []);
  });
