import moment from 'moment';
import {pickEventPretext} from '../../utils/trip.js';
import {capitilizeFirstLetter, humanizeDuration} from '../../utils/common.js';

const createOfferItemTemplate = ({name, price}) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
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
    .map((o) => createOfferItemTemplate(o))
    .join(``);

  return `<ul class="event__selected-offers">
    ${offerItems}
  </ul>`;
};

export const createEventItemTemplate = ({destination, type, basePrice, offers, startDate, finishDate}) => {
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitilizeFirstLetter(type)} ${pickEventPretext(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${moment(startDate).format(`YYYY-MM-DD[T]hh:mm`)}>${moment(startDate).format(`hh:mm`)}</time>
            —
            <time class="event__end-time" datetime=${moment(finishDate).format(`YYYY-MM-DD[T]hh:mm`)}>${moment(finishDate).format(`hh:mm`)}</time>
          </p>
          <p class="event__duration">${humanizeDuration(finishDate, startDate)}</p>
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
