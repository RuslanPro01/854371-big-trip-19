import {
  CITIES,
  CITY_DESCRIPTIONS,
  NUMBER_POINTS_CREATED
} from '../const.js';
import {
  getRandomArrayElement,
  getRandomNumber
} from '../utils/utils-mock.js';

let destinationId = 1;
const createDestination = () => ({
  id: destinationId++,
  description: getRandomArrayElement(CITY_DESCRIPTIONS),
  name: CITIES[destinationId - 1],
  pictures: [
    {
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(100000)}`,
      description: getRandomArrayElement(CITY_DESCRIPTIONS)
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(100000)}`,
      description: getRandomArrayElement(CITY_DESCRIPTIONS)
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(100000)}`,
      description: getRandomArrayElement(CITY_DESCRIPTIONS)
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(100000)}`,
      description: getRandomArrayElement(CITY_DESCRIPTIONS)
    }
  ]
});

export const destinations = Array.from({length: NUMBER_POINTS_CREATED}, createDestination);
