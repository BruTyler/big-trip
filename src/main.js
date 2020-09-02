import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import TripSummaryView from './view/trip-summary.js';
import TripPathView from './view/trip-path.js';
import TripCostView from './view/trip-cost.js';
import TripTabsView from './view/trip-tabs.js';
import EventAddButtonView from './view/event-add-button.js';
import {generateEvent} from './mocks/event.js';
import {generateDestinations} from './mocks/destinations.js';
import {generateOffers} from './mocks/offers.js';
import {render} from './utils/render.js';
import {RenderPosition} from './const.js';

const TRIP_EVENT_COUNT = 20;

const destinations = generateDestinations();
const tripOffers = generateOffers();
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(() => generateEvent(destinations, tripOffers));

const destinationsModel = new DestinationsModel();
destinationsModel.setItems(destinations);

const offersModel = new OffersModel();
offersModel.setItems(tripOffers);

const pointsModel = new PointsModel();
pointsModel.setItems(tripEvents);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);

const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripSummaryComponent = new TripSummaryView();
render(tripMainElement, tripSummaryComponent, RenderPosition.AFTERBEGIN);

render(tripSummaryComponent, new TripPathView(pointsModel), RenderPosition.BEFOREEND);
render(tripSummaryComponent, new TripCostView(pointsModel), RenderPosition.BEFOREEND);

const tripMenuElement = siteHeaderElement.querySelector(`.trip-controls`);
render(tripMenuElement, new TripTabsView(), RenderPosition.BEFOREEND);

render(tripMainElement, new EventAddButtonView(), RenderPosition.BEFOREEND);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const filterPresenter = new FilterPresenter(tripMenuElement, filterModel);
const tripPresenter = new TripPresenter(tripEventsElement, {pointsModel, offersModel, destinationsModel, filterModel});

filterPresenter.init();
tripPresenter.init();
