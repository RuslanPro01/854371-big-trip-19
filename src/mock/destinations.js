import {
  CITIES,
  CITY_DESCRIPTIONS,
  NUMBER_POINTS_CREATED
} from '../const.js';
import {
  getRandomArrayElement,
  getRandomNumber
} from '../utils/utils-mock.js';

const generatorId = (number = 0) => () => number++;
const destinationId = generatorId(1);
const gitCityNameIndex = generatorId(0);
const createDestination = () => ({
  id: destinationId(),
  description: getRandomArrayElement(CITY_DESCRIPTIONS),
  name: CITIES[gitCityNameIndex()],
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
