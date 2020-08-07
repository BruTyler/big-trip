import moment from 'moment';

export const capitilizeFirstLetter = (word) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
};

export const transformToStringId = (word) => {
  return word.replace(/\s/g, `-`).toLowerCase();
};

export const excludeRepeatingInSequence = (repeatingItems) =>
  repeatingItems.reduce((clearItems, item) => {
    if (clearItems.length === 0 || clearItems[clearItems.length - 1] !== item) {
      return [...clearItems, item];
    }
    return clearItems;
  }, []);

const addLeadZero = (digit) => {
  return digit < 10
    ? `0` + digit
    : digit;
};

export const humanizeDuration = (finishDate, startDate) => {
  const startMoment = moment(finishDate)
    .subtract(finishDate.getSeconds(), `seconds`)
    .subtract(finishDate.getMilliseconds(), `milliseconds`);
  const finishMoment = moment(startDate)
    .subtract(startDate.getSeconds(), `seconds`)
    .subtract(startDate.getMilliseconds(), `milliseconds`);

  const duration = moment.duration(startMoment.diff(finishMoment));
  const readableDurations = [];

  if (duration.days() > 0) {
    readableDurations.push(`${addLeadZero(duration.days())}D`);
  }

  if (duration.hours() > 0) {
    readableDurations.push(`${addLeadZero(duration.hours())}H`);
  }

  if (duration.minutes() > 0) {
    readableDurations.push(`${addLeadZero(duration.minutes())}M`);
  }

  return readableDurations.join(` `);
};
