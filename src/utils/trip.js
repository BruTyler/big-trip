import {ActivityType, PretextType} from '../const.js';

export const pickEventPretext = (eventType) => {
  return Object.values(ActivityType).includes(eventType)
    ? PretextType.ACTIVITY
    : PretextType.MOVE;
};
