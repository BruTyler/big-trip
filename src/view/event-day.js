import moment from 'moment';
import EventPointView from './event-point.js';
import {createElement} from '../utils/render.js';

const createEventPointsTemplate = (tripEvents) => {
  return tripEvents
    .map((event) => new EventPointView(event).getTemplate())
    .join(``);
};

const createEventDayTemplate = (dayId, eventDate, tripEvents) => {
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

export default class EventDay {
  constructor(dayId, eventDate, tripEvents) {
    this._dayId = dayId;
    this._eventDate = eventDate;
    this._tripEvents = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createEventDayTemplate(this._dayId, this._eventDate, this._tripEvents);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
