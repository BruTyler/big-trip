import {getTotalEventPrice} from '../utils/trip.js';

export const createTripCostTemplate = (tripEvents) => {

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
