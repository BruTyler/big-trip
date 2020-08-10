import {createElement} from '../utils/render.js';

export const createTripSummaryTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    </section>`
  );
};

export default class TripSummary {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripSummaryTemplate();
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
