import moment from 'moment';
import {createEventPointTemplate} from './event-point.js';

const createEventPointsTemplate = (tripEvents) => {
  return tripEvents
    .map((event) => createEventPointTemplate(event))
    .join(``);
};

export const createEventDayTemplate = (dayId, eventDate, tripEvents) => {
  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayId}</span>
          <time class="day__date" datetime="${moment(eventDate).format(`YYYY-MM-DD`)}">${moment(eventDate).format(`MMM DD`)}</time>
        </div>

        <ul class="trip-events__list">
          ${createEventPointsTemplate(tripEvents)}
        </ul>
      </li>
    </ul>`
  );
};
