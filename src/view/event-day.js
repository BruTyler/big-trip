import moment from 'moment';
import AbstractView from '../abstract/simple-view.js';

const createDayTitleTemplate = (dayId, groupedDate) => {
  if (groupedDate === null) {
    return ``;
  }

  return (
    `<span class="day__counter">${dayId}</span>
    <time class="day__date" datetime="${moment(groupedDate).format(`YYYY-MM-DD`)}">${moment(groupedDate).format(`MMM DD`)}</time>`
  );
};

const createEventDayTemplate = (dayId, groupedDate) => {
  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          ${createDayTitleTemplate(dayId, groupedDate)}
        </div>

        <ul class="trip-events__list">
        </ul>
      </li>
    </ul>`
  );
};

export default class EventDay extends AbstractView {
  constructor(dayId, groupedDate = null) {
    super();

    this._dayId = dayId;
    this._groupedDate = groupedDate;
  }

  getTemplate() {
    return createEventDayTemplate(this._dayId, this._groupedDate);
  }

  getPointContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
