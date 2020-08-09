import moment from 'moment';
import {EventType, MoveType, ActivityType, DefaultValues} from '../const.js';
import {capitilizeFirstLetter, transformToStringId} from '../utils/common.js';
import {pickEventPretext} from '../utils/trip.js';

const createEventTypesTemplate = (pointId, specificType) => {
  return Object.values(specificType)
    .map((type) => (
      `<div class="event__type-item">
        <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${capitilizeFirstLetter(type)}</label>
      </div>`))
    .join(``);
};

const createDestinationItemsTemplate = (destinations) => {
  return destinations
    .map((city) => (
      `<option value="${city.name}"></option>`
    ))
    .join(``);
};

const createAvailableOffersTemplate = (pointId, availableOffers, selectedOffers) => {
  if (availableOffers.length === 0) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${availableOffers
      .map((singleOffer) => createOfferItemTemplate(
          pointId,
          singleOffer,
          selectedOffers.includes(singleOffer)
      ))
      .join(``)
    }
    </div>`
  );
};

const createOfferItemTemplate = (pointId, offer, isChecked) => {
  const shortTitle = transformToStringId(offer.title);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${shortTitle}-${pointId}" type="checkbox" name="event-offer-${shortTitle}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${shortTitle}-${pointId}">
        <span class="event__offer-title">${offer.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createConcreteDestinationTemplate = (pointId, destination) => {
  if (destination === null || !destination.name || pointId !== DefaultValues.POINT_ID) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
    ${destination.pictures
      .map((picUrl) => (`<img class="event__photo" src="${picUrl}" alt="Event photo">`))
      .join(``)
    }
      </div>
    </div>`
  );
};

const createResetButtonTemplate = (pointId) => {
  return `<button class="event__reset-btn" type="reset">${pointId === DefaultValues.POINT_ID ? `Cancel` : `Delete`}</button>`;
};

const createFavoriteButtonTemplate = (pointId, isFavorite) => {
  if (pointId === DefaultValues.POINT_ID) {
    return ``;
  }

  return `<input id="event-favorite-${pointId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
  <label class="event__favorite-btn" for="event-favorite-${pointId}">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>`;
};

const createRollupButtonTemplate = (pointId) => {
  if (pointId === DefaultValues.POINT_ID) {
    return ``;
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

export const createEventEditorTemplate = (eventItem = {}, destinations = [], tripOffers = []) => {
  const {
    id = DefaultValues.POINT_ID,
    destination = {name: ``},
    type = EventType.FLIGHT,
    basePrice = ``,
    offers = [],
    startDate = new Date(),
    finishDate = new Date(),
    isFavorite = false,
  } = eventItem;

  const availableOffers = tripOffers.find((x) => x.type === type).offers;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createEventTypesTemplate(id, MoveType)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createEventTypesTemplate(id, ActivityType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${capitilizeFirstLetter(type)} ${pickEventPretext(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createDestinationItemsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${moment(startDate).format(`DD/MM/YY HH:mm`)}">
          —
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${moment(finishDate).format(`DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${createResetButtonTemplate(id)}

        ${createFavoriteButtonTemplate(id, isFavorite)}
        ${createRollupButtonTemplate(id)}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${createAvailableOffersTemplate(id, availableOffers, offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${createConcreteDestinationTemplate(id, destination)}
        </section>
      </section>
    </form>`
  );
};
