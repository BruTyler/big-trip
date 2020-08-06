import {EventType} from '../src/const.js';
import {generateRandomInt, pickRandomElement} from '../src/utils/random.js';

const offerDetails = [`Rent a car`, `Good option`, `Perfect option`, `Ideal option`, `Improve class`, `Take a boost`];

const getRandomOffers = () => {
  const offerCount = generateRandomInt(0, 5);
  return new Array(offerCount)
    .fill()
    .map(() => ({
      name: pickRandomElement(offerDetails),
      price: generateRandomInt(10, 200)
    }));
};

export const generateOffers = () => Object.values(EventType).map((type) =>
  ({
    type,
    offers: getRandomOffers(),
  }));
