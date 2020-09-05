import {StatsType, MoveType} from '../const';
import moment from 'moment';

const extractValue = (event, statsType) => {
  let result = 0;

  switch (statsType) {
    case StatsType.MONEY:
      result += event.basePrice;
      break;
    case StatsType.TRANSPORT:
      if (Object.values(MoveType).includes(event.type)) {
        result++;
      } else {
        result = null;
      }
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

      const extractedValue = extractValue(event, statsType);
      if (extractedValue) {
        groupedEvents[event.type] = extractedValue;
      }

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


