import moment from 'moment';
import {createElement} from '../utils/render.js';

const createDayTitleTemplate = (dayId, eventDate) => {
  if (dayId === null) {
    return ``;
  }

  return (
    `<span class="day__counter">${dayId}</span>
    <time class="day__date" datetime="${moment(eventDate).format(`YYYY-MM-DD`)}">${moment(eventDate).format(`MMM DD`)}</time>`
  );
};

const createEventDayTemplate = (dayId, eventDate) => {
  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          ${createDayTitleTemplate(dayId, eventDate)}
        </div>

        <ul class="trip-events__list">
        </ul>
      </li>
    </ul>`
  );
};

export default class EventDay {
  constructor(dayId = null, eventDate = null) {
    this._dayId = dayId;
    this._eventDate = eventDate;
    this._element = null;
  }

  getTemplate() {
    return createEventDayTemplate(this._dayId, this._eventDate);
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
