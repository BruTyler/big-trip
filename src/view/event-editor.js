import moment from 'moment';
import flatpickr from 'flatpickr';
import SmartView from '../abstract/smart-view.js';
import {EventType, MoveType, ActivityType, DefaultValues, EditState} from '../const.js';
import {capitalizeFirstLetter, transformToStringId} from '../utils/common.js';
import {pickEventPretext, defineDestination, defineAvailableOffers, isPendingState} from '../utils/trip.js';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const BLANK_EVENT = {
  id: DefaultValues.POINT_ID,
  destination: {name: ``},
  type: EventType.FLIGHT,
  basePrice: ``,
  offers: [],
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false
};

const createEventTypesTemplate = (selectedEventType) => {
  return Object.values(selectedEventType)
    .map((type) => (
      `<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}" data-type="${type}">${capitalizeFirstLetter(type)}</label>
      </div>`))
    .join(``);
};

const createDestinationItemsTemplate = (destinations, currentDestination, pointId) => {
  const {name: currentCity} = currentDestination;

  const destinationOptions = destinations
    .map((city) => (
      `<option value="${city.name}" ${currentCity === city.name ? `selected` : ``}>
        ${city.name}
      </option>`));

  if (pointId === DefaultValues.POINT_ID) {
    destinationOptions.unshift(`<option selected disabled></option>`);
  }

  return destinationOptions.join(``);
};

const createAvailableOffersTemplate = (availableOffers, selectedOffers, isDisabled) => {
  if (availableOffers.length === 0) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${availableOffers
      .map((singleOffer) => createOfferItemTemplate(
          singleOffer,
          selectedOffers.some((selectedOffer) => selectedOffer.title === singleOffer.title),
          isDisabled
      ))
      .join(``)
    }
    </div>`
  );
};

const createOfferItemTemplate = (offer, isChecked, isDisabled) => {
  const shortTitle = transformToStringId(offer.title);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${shortTitle}" type="checkbox" 
        name="event-offer-${shortTitle}" 
        value="${offer.title}" 
        ${isChecked ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      >
      <label class="event__offer-label" for="event-offer-${shortTitle}">
        <span class="event__offer-title">${offer.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createConcreteDestinationTemplate = (destination) => {
  if (destination === null || !destination.description) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
    ${destination.pictures
      .map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`))
      .join(``)
    }
      </div>
    </div>`
  );
};

const createSubmitButtonTemplate = (isDisabled, editState) => {
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit"
      ${isDisabled ? `disabled` : ``}
    >
      ${editState === EditState.SAVING ? `Saving...` : `Save`} 
    </button>`
  );
};

const createResetButtonTemplate = (pointId, isDisabled, editState) => {
  let buttonLabel = `Delete`;

  if (pointId === DefaultValues.POINT_ID) {
    buttonLabel = `Cancel`;
  }

  if (editState === EditState.DELETING) {
    buttonLabel = `Deleting...`;
  }
  return (
    `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
      ${buttonLabel}
    </button>`
  );
};

const createFavoriteButtonTemplate = (pointId, isFavorite) => {
  if (pointId === DefaultValues.POINT_ID) {
    return ``;
  }

  return `<input id="event-favorite" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
  <label class="event__favorite-btn" for="event-favorite">
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

const createEventEditorTemplate = (eventItem, destinations, tripOffers, editState) => {
  const {
    id, destination, type, basePrice, offers: selectedOffers,
    startDate, endDate, isFavorite
  } = eventItem;

  const isInterfaceDisabled = isPendingState(editState);
  const priceValue = isNaN(basePrice) ? `` : basePrice;
  const availableOffers = defineAvailableOffers(type, tripOffers);
  const isSubmitDisabled = isNaN(basePrice) || destination.name === `` || isInterfaceDisabled;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox" 
            ${isInterfaceDisabled ? `disabled` : ``}
          >

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createEventTypesTemplate(MoveType)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createEventTypesTemplate(ActivityType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${capitalizeFirstLetter(type)} ${pickEventPretext(type)}
          </label>
          <select class="event__input  event__input--destination" id="event-destination" 
            name="event-destination" value="${destination.name}" list="destination-list"
            ${isInterfaceDisabled ? `disabled` : ``}
          >
            <datalist id="destination-list">
              ${createDestinationItemsTemplate(destinations, destination, id)}
            </datalist>
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" 
            value="${moment(startDate).format(`DD/MM/YY HH:mm`)} ${isInterfaceDisabled ? `disabled` : ``}"
          >
          —
          <label class="visually-hidden" for="event-end-time">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" 
            value="${moment(endDate).format(`DD/MM/YY HH:mm`)} ${isInterfaceDisabled ? `disabled` : ``}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price" type="number" min="1" name="event-price" 
            value="${priceValue}" autocomplete="off"
            ${isInterfaceDisabled ? `disabled` : ``}
          >
        </div>

        ${createSubmitButtonTemplate(isSubmitDisabled, editState)}
        ${createResetButtonTemplate(id, isInterfaceDisabled, editState)}
        ${createFavoriteButtonTemplate(id, isFavorite)}
        ${createRollupButtonTemplate(id)}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${createAvailableOffersTemplate(availableOffers, selectedOffers, isInterfaceDisabled)}
        </section>
        <section class="event__section  event__section--destination">
          ${createConcreteDestinationTemplate(destination)}
        </section>
      </section>
    </form>`
  );
};

export default class EventEditor extends SmartView {
  constructor(destinations = [], tripOffers = [], eventItem = BLANK_EVENT) {
    super();

    this._item = eventItem;
    this._sourceItem = eventItem;
    this._destinations = destinations;
    this._tripOffers = tripOffers;
    this._datepickers = {
      start: null,
      end: null
    };

    this._editState = EditState.DEFAULT;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset() {
    this._editState = EditState.DEFAULT;
    this.updateData(this._sourceItem);
  }

  getTemplate() {
    return createEventEditorTemplate(this._item, this._destinations, this._tripOffers, this._editState);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    if (this._callback.cancelClick) {
      this.setCancelClickHandler(this._callback.cancelClick);
    }
    if (this._callback.favoriteClick) {
      this.setFavoriteClickHandler(this._callback.favoriteClick);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeClickHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationInputHandler);
  }

  setEditState(state) {
    this._editState = state;
    this.updateElement();
  }

  _setDatepickers() {
    Object.entries(this._datepickers).forEach(([pickerKey, pickerInstance]) => {
      if (pickerInstance) {
        pickerInstance.destroy();
        pickerInstance = null;
      }

      this._datepickers[pickerKey] = flatpickr(
          this.getElement().querySelector(`#event-${pickerKey}-time`),
          {
            dateFormat: `d/m/y H:i`,
            defaultDate: this._item[`${pickerKey}Date`],
            enableTime: true,
            // eslint-disable-next-line camelcase
            time_24hr: true,
            minDate: pickerKey === `end` ? this._item.startDate : new Date(2000, 1, 1),
            onChange: (evt) => this._dateChangeHandler(evt, `${pickerKey}Date`),
          }
      );
    });
  }

  _dateChangeHandler([selectedDate], dateKey) {
    if (selectedDate) {
      const updatedProperty = Object.create(null);
      updatedProperty[dateKey] = selectedDate;
      let isRenderActual = true;

      if (dateKey === `startDate`) {
        isRenderActual = false;
      }

      if (dateKey === `startDate` && moment(selectedDate).isAfter(this._item.endDate)) {
        updatedProperty[`endDate`] = selectedDate;
      }

      this.updateData(updatedProperty, isRenderActual);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const basePrice = parseInt(evt.target.value, 10);
    const isRenderActual = !(isNaN(basePrice) || isNaN(this._item.basePrice));
    this.updateData({basePrice}, isRenderActual);
  }

  _typeClickHandler(evt) {
    evt.preventDefault();
    const selectedEventType = evt.target.dataset.type;

    if (selectedEventType === this._item.type) {
      this.getElement().querySelector(`.event__type-btn`).click();
      return;
    }

    this.updateData({
      type: selectedEventType,
      offers: []
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const selectedCity = evt.target.value;

    if (selectedCity === this._item.destination.name) {
      return;
    }

    const updatedProperty = defineDestination(this._destinations, selectedCity);
    const isRenderActual = updatedProperty.description === this._item.destination.description;

    this.updateData({
      destination: updatedProperty
    }, isRenderActual);
  }

  _defineSelectedOffers() {
    const availableOffers = defineAvailableOffers(this._item.type, this._tripOffers);
    const checkedTitles = Array
      .from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => element.value);

    const offers = availableOffers.filter((offer) => checkedTitles.includes(offer.title));

    this.updateData({offers}, true);
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this.reset();
    this._callback.cancelClick();
  }

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._sourceItem.isFavorite
    }, true);
    this._sourceItem = this._item;
    this._callback.favoriteClick(this._item);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._defineSelectedOffers();
    this._sourceItem = this._item;
    this.setEditState(EditState.SAVING);
    this._callback.formSubmit(this._item);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this.setEditState(EditState.DELETING);
    this._callback.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._cancelClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}
