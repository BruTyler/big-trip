import {StatsType} from '../const';
import {getTotalEventPrice} from './trip';
import moment from 'moment';

const extractValue = (event, statsType) => {
  let result = 0;

  switch (statsType) {
    case StatsType.MONEY:
      result += getTotalEventPrice(event);
      break;
    case StatsType.TRANSPORT:
      result++;
      break;
    case StatsType.TIME_SPENT:
      const startMoment = moment(event.startDate);
      const finishMoment = moment(event.endDate);
      result += moment.duration(finishMoment.diff(startMoment));
  }

  return result;
};

const roundResult = (rawValue, statsType) => {
  switch (statsType) {
    case StatsType.TIME_SPENT:
      return moment.duration(rawValue).hours() + 1;
    default:
      return Math.round(rawValue);
  }
};

export const calculateStat = (events, statsType) => {
  const groupedEvents = Object.create(null);

  events.forEach((event) => {
    if (!groupedEvents[event.type]) {
      groupedEvents[event.type] = extractValue(event, statsType);
    } else {
      groupedEvents[event.type] += extractValue(event, statsType);
    }
  });

  Object.keys(groupedEvents).forEach((statKey) => {
    groupedEvents[statKey] = roundResult(groupedEvents[statKey], statsType);
    return;
  });

  return groupedEvents;
};


