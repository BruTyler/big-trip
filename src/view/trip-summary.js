import AbstractView from './abstract.js';

export const createTripSummaryTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    </section>`
  );
};

export default class TripSummary extends AbstractView {
  getTemplate() {
    return createTripSummaryTemplate();
  }
}
