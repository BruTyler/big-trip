import {ActivityType, PretextType, SortType, FilterType} from '../const.js';
import moment from 'moment';

export const pickEventPretext = (eventType) => {
  return Object.values(ActivityType).includes(eventType)
    ? PretextType.ACTIVITY
    : PretextType.MOVE;
};

export const getSorterRule = (sortType) => {
  switch (sortType) {
    case SortType.TIME:
      return (eventA, eventB) => {
        const durationA = moment(eventA.finishDate).diff(moment(eventA.startDate));
        const durationB = moment(eventB.finishDate).diff(moment(eventB.startDate));
        return durationB - durationA;
      };
    case SortType.PRICE:
      return (eventA, eventB) => getTotalEventPrice(eventB) - getTotalEventPrice(eventA);
    default:
      return (eventA, eventB) => moment(eventA.startDate) - moment(eventB.startDate);
  }
};

export const getFilterRule = (filterType) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return (event) => moment().isBefore(event.startDate);
    case FilterType.PAST:
      return (event) => moment().isAfter(event.finishDate);
    default:
      return () => true;
  }
};

export const getTotalEventPrice = (event) => {
  return event.offers.reduce(
      (offerSum, offer) => offer.price + offerSum,
      event.basePrice
  );
};

export const splitEventsByDays = (sortedEvents) => {
  const groupedEvents = Object.create(null);

  sortedEvents.forEach((event) => {
    const shortDay = moment(event.startDate).format(`YYYY-MM-DD`);

    if (!groupedEvents[shortDay]) {
      groupedEvents[shortDay] = [event];
    } else {
      groupedEvents[shortDay].push(event);
    }
  });

  return groupedEvents;
};

export const convertToNullableDate = (shortDay) => {
  const parsedTime = Date.parse(shortDay);
  return isNaN(parsedTime) ? null : new Date(parsedTime);
};

export const groupEvents = (sortType, sortedTripEvents) => {
  let groupedEvents = Object.create(null);

  switch (sortType) {
    case SortType.EVENT:
      groupedEvents = splitEventsByDays(sortedTripEvents);
      break;
    default:
      groupedEvents = {emptyDayWrapper: sortedTripEvents};
      break;
  }

  return groupedEvents;
};

export const defineDestination = (destinations, selectedCity) => {
  const destination = destinations.find((d) => d.name === selectedCity);

  if (destination) {
    return destination;
  }

  return {name: selectedCity};
};

export const defineAvailableOffers = (eventType, tripOffers) => {
  if (tripOffers.length === 0) {
    return [];
  }

  return tripOffers.find((x) => x.type === eventType).offers;
};
