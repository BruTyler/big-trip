import {nanoid} from 'nanoid';
import {pickRandomElement, generateRandomInt, pickRandomDate, pickRandomElements} from '../utils/random.js';
import {EventType} from '../const.js';

const maxStartDaysGap = 4;
const maxDurationEventMinutes = 135;

export const generateEvent = (availableDestinations, availableOffers) => {
  const type = pickRandomElement(Object.values(EventType));
  const startDate = pickRandomDate(maxStartDaysGap * 24 * 60);
  const filteredOffers = availableOffers.find((x) => x.type === type).offers;

  return {
    id: nanoid(5),
    destination: pickRandomElement(availableDestinations),
    type,
    basePrice: generateRandomInt(2, 50) * 10,
    offers: pickRandomElements(filteredOffers, 0, filteredOffers.length - 1),
    startDate,
    finishDate: pickRandomDate(maxDurationEventMinutes, startDate),
    isFavorite: Boolean(generateRandomInt(0, 1)),
  };
};
