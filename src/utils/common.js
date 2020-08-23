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

export const humanizeDuration = (endDate, startDate) => {
  const startMoment = moment(endDate)
    .subtract(endDate.getSeconds(), `seconds`)
    .subtract(endDate.getMilliseconds(), `milliseconds`);
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

export const extend = (objectA, objectB) => {
  return Object.assign({}, objectA, objectB);
};

export const updateItemById = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};

export const removeItemById = (items, updatedItem) => {
  if (items.length === 0) {
    return items;
  }

  return items.filter((item) => item.id !== updatedItem.id);
};
