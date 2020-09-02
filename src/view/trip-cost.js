import AbstractView from '../abstract/simple-view.js';
import {getTotalEventPrice} from '../utils/trip.js';

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

export default class TripCost extends AbstractView {
  constructor(pointsModel) {
    super();

    this._tripEvents = pointsModel.getItems();
  }

  getTemplate() {
    return createTripCostTemplate(this._tripEvents);
  }
}
