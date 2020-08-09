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
      return (a, b) => {
        const durationA = moment(a.finishDate).diff(moment(a.startDate));
        const durationB = moment(b.finishDate).diff(moment(b.startDate));
        return durationB - durationA;
      };
    case SortType.PRICE:
      return (a, b) => getTotalEventPrice(b) - getTotalEventPrice(a);
    default:
      return (a, b) => moment(a.startDate) - moment(b.startDate);
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
  const groupedEvents = {};

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
