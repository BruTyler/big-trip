import {getTotalEventPrice} from '../utils/trip.js';
import {createElement} from '../utils/render.js';

const createTripCostTemplate = (tripEvents) => {
  const cost = tripEvents.reduce(
      (accumulatedSum, event) => accumulatedSum + getTotalEventPrice(event),
      0
  );

  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._tripEvents);
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
