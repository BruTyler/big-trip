export const generateRandomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

export const pickRandomElement = (array) => {
  if (array === undefined || array === null || array.length === 0) {
    throw new Error(`Incorrect array`);
  }

  const randomIndex = generateRandomInt(0, array.length - 1);
  return array[randomIndex];
};

export const pickRandomElements = (array, minElementCount, maxElementCount) => {
  if (array === undefined || array === null) {
    throw new Error(`Incorrect array`);
  }

  if (array.length === 0) {
    return [];
  }

  const elementsCount = generateRandomInt(minElementCount, maxElementCount);

  if (elementsCount === 0) {
    return [];
  }

  return Array
    .from(array)
    .sort(() => 0.5 - Math.random())
    .slice(0, elementsCount);
};

export const pickRandomDate = (maxMinuteOffset, startDate = null) => {
  const millisecOffset = 1000 * 60 * maxMinuteOffset;
  const randomTimeOffset = generateRandomInt(0, +millisecOffset);
  const startTime = startDate !== null
    ? startDate.getTime()
    : new Date().getTime();

  return new Date(startTime + randomTimeOffset);
};
