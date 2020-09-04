import {excludeRepeatingInSequence} from '../utils/common.js';
import moment from 'moment';
import AbstractView from '../abstract/simple-view.js';
import {getSorterRule} from '../utils/trip.js';
import {SortType} from '../const.js';

const createDatesTemplate = (sortedEvents) => {
  const tripStartDate = sortedEvents[0].startDate;
  const tripEndDate = sortedEvents[sortedEvents.length - 1].endDate;
  const isSameDay = moment(tripStartDate).isSame(tripEndDate, `day`);
  const isSameMonth = moment(tripStartDate).isSame(tripEndDate, `month`);

  let summaryDates = ``;
  const firstHumanizeDate = moment(tripStartDate).format(`MMM DD`);

  if (isSameDay) {
    summaryDates = firstHumanizeDate;
  } else if (isSameMonth) {
    summaryDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripEndDate).format(`DD`)}`;
  } else {
    summaryDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripEndDate).format(`MMM DD`)}`;
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
    .sort(getSorterRule(SortType.EVENT));

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createCitiesTemplate(sortedEvents)}</h1>
      <p class="trip-info__dates">${createDatesTemplate(sortedEvents)}</p>
    </div>`
  );
};

export default class TripPath extends AbstractView {
  constructor(points) {
    super();

    this._tripEvents = points;
  }

  getTemplate() {
    return createTripPathTemplate(this._tripEvents);
  }
}
