import {excludeRepeatingInSequence} from '../utils/common.js';
import moment from 'moment';

const createDatesTemplate = (sortedEvents) => {
  const tripStartDate = sortedEvents[0].startDate;
  const tripFinishDate = sortedEvents[sortedEvents.length - 1].finishDate;
  const isSameDay = moment(tripStartDate).isSame(tripFinishDate, `day`);
  const isSameMonth = moment(tripStartDate).isSame(tripFinishDate, `month`);

  let summaryDates = ``;

  if (isSameDay) {
    summaryDates = moment(tripStartDate).format(`MMM DD`);
  } else if (isSameMonth) {
    summaryDates = `${moment(tripStartDate).format(`MMM DD`)}&nbsp;—&nbsp;${moment(tripFinishDate).format(`DD`)}`;
  } else {
    summaryDates = `${moment(tripStartDate).format(`MMM DD`)}&nbsp;—&nbsp;${moment(tripFinishDate).format(`MMM DD`)}`;
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


export const createTripPathTemplate = (tripEvents) => {
  if (tripEvents.length === 0) {
    return ``;
  }

  const sortedEvents = Array.from(tripEvents).sort((a, b) => a.startDate - b.startDate);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createCitiesTemplate(sortedEvents)}</h1>
      <p class="trip-info__dates">${createDatesTemplate(sortedEvents)}</p>
    </div>`
  );
};
