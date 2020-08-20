import {EventType} from '../const.js';
import {generateRandomInt, pickRandomElements} from '../utils/random.js';

const offerDetails = [`Rent a car`, `Good option`, `Perfect option`, `Ideal option`, `Improve class`, `Take a boost`];

const getRandomOffers = () => {
  const offers = pickRandomElements(offerDetails, 0, 5);

  return offers
    .map((title) => ({
      title,
      price: generateRandomInt(10, 200)
    }));
};

export const generateOffers = () => Object.values(EventType).map((type) =>
  ({
    type,
    offers: getRandomOffers(),
  }));
