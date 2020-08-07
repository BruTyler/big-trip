export const generateRandomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

export const pickRandomElement = (elements) => {
  if (elements === undefined || elements === null || elements.length === 0) {
    throw new Error(`Incorrect array`);
  }

  const randomIndex = generateRandomInt(0, elements.length - 1);
  return elements[randomIndex];
};

export const pickRandomElements = (elements, minElementCount, maxElementCount) => {
  if (elements === undefined || elements === null) {
    throw new Error(`Incorrect array`);
  }

  if (elements.length === 0) {
    return [];
  }

  const elementsCount = generateRandomInt(minElementCount, maxElementCount);

  if (elementsCount === 0) {
    return [];
  }

  return elements
    .slice()
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
