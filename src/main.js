import StoreFactory from './model/store-factory.js';
import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import SummaryPresenter from './presenter/summary.js';
import MenuPresenter from './presenter/menu.js';
import TripPresenter from './presenter/trip.js';
import StatsPresenter from './presenter/stats.js';
import {ModelType, UpdateType} from './const.js';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-cache`;
const STORE_VER = `v2`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const modelStore = StoreFactory.create();

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const statsElement = siteMainElement.querySelector(`.page-body__container`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const tripPresenter = new TripPresenter(tripEventsElement, modelStore, apiWithProvider);
const statsPresenter = new StatsPresenter(statsElement, modelStore);

summaryPresenter.init();
tripPresenter.init();
statsPresenter.init();

const fetchedDataPromises = [
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints()
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
