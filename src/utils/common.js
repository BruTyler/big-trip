import moment from 'moment';

export const capitilizeFirstLetter = (word) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
};

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

  if (duration._data.days > 0) {
    readableDurations.push(`${addLeadZero(duration._data.days)}D`);
  }

  if (duration._data.hours > 0) {
    readableDurations.push(`${addLeadZero(duration._data.hours)}H`);
  }

  if (duration._data.minutes > 0) {
    readableDurations.push(`${addLeadZero(duration._data.minutes)}M`);
  }

  return readableDurations.join(` `);
};