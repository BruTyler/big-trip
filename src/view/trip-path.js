import {excludeRepeatingInSequence} from '../utils/common.js';
import moment from 'moment';
import AbstractView from './abstract.js';
import {getSorterRule} from '../utils/trip.js';
import {SortType} from '../const.js';

const createDatesTemplate = (sortedEvents) => {
  const tripStartDate = sortedEvents[0].startDate;
  const tripFinishDate = sortedEvents[sortedEvents.length - 1].finishDate;
  const isSameDay = moment(tripStartDate).isSame(tripFinishDate, `day`);
  const isSameMonth = moment(tripStartDate).isSame(tripFinishDate, `month`);

  let summaryDates = ``;
  const firstHumanizeDate = moment(tripStartDate).format(`MMM DD`);

  if (isSameDay) {
    summaryDates = firstHumanizeDate;
  } else if (isSameMonth) {
    summaryDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripFinishDate).format(`DD`)}`;
  } else {
    summaryDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripFinishDate).format(`MMM DD`)}`;
  }

  return summaryDates;
};

const createCitiesTemplate = (sortedEvents) => {
  let collapsedCities = excludeRepeatingInSequence(sortedEvents.map((event) => event.destination.name));

  const summaryPoints = [];
  summaryPoints.push(collapsedCities[0]);

  switch (collapsedCities.length) {
    case 1:
      break;
    case 2:
      summaryPoints.push(collapsedCities[1]);
      break;
    default:
      summaryPoints.push(`...`);
      summaryPoints.push(collapsedCities[collapsedCities.length - 1]);
      break;
  }

  return summaryPoints.join(`&nbsp;—&nbsp;`);
};


const createTripPathTemplate = (tripEvents) => {
  if (tripEvents.length === 0) {
    return `<div class="trip-info__main"></div>`;
  }

  const sortedEvents = tripEvents
    .slice()
    .sort(getSorterRule(SortType.EVENT));

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createCitiesTemplate(sortedEvents)}</h1>
      <p class="trip-info__dates">${createDatesTemplate(sortedEvents)}</p>
    </div>`
  );
};

export default class TripPath extends AbstractView {
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;
  }

  getTemplate() {
    return createTripPathTemplate(this._tripEvents);
  }
}
