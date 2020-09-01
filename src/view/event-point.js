import moment from 'moment';
import AbstractView from '../abstract/simple-view.js';
import {pickEventPretext} from '../utils/trip.js';
import {capitilizeFirstLetter, humanizeDuration} from '../utils/common.js';
import {BuisnessRequirements} from '../const.js';

const createOfferItemTemplate = ({title, price}) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      +
      €&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  const offerItems = offers
    .slice(0, BuisnessRequirements.MAX_VISIBLE_OFFERS_PER_POINT)
    .map((o) => createOfferItemTemplate(o))
    .join(``);

  return `<ul class="event__selected-offers">
    ${offerItems}
  </ul>`;
};

const createEventPointTemplate = ({destination, type, basePrice, offers, startDate, endDate}) => {
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitilizeFirstLetter(type)} ${pickEventPretext(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${moment(startDate).format(`YYYY-MM-DD[T]HH:mm`)}>${moment(startDate).format(`HH:mm`)}</time>
            —
            <time class="event__end-time" datetime=${moment(endDate).format(`YYYY-MM-DD[T]HH:mm`)}>${moment(endDate).format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${humanizeDuration(endDate, startDate)}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        ${createOffersTemplate(offers)}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventPoint extends AbstractView {
  constructor(tripEvent) {
    super();

    this._tripEvent = tripEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventPointTemplate(this._tripEvent);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
