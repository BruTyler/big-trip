export const createTripCostTemplate = (tripEvents) => {

  const cost = tripEvents.reduce(
      (baseSum, event) => event.basePrice + baseSum + event.offers.reduce(
          (offerSum, offer) => offer.price + offerSum,
          0
      ),
      0
  );

  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};
