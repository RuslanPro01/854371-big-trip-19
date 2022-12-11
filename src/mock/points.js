import {
  getRandomNumber,
  RandomPointDate,
  getRandomPrice,
  getRandomArrayElement
} from '../utils.js';
import {
  MAX_PRICE,
  NUMBER_POINTS_CREATED,
  POINT_TYPES
} from '../const.js';
import {destinations} from './destinations.js';
import {offers} from './offer.js';

let pointId = 1;

const createPoint = () => ({
  basePrice: getRandomPrice(MAX_PRICE),
  dayFrom: RandomPointDate.GET_DATE_FROM(),
  dayTo: RandomPointDate.GET_DATE_TO(),
  destination: destinations[pointId - 1],
  offers: offers[pointId - 1],
  id: pointId++,
  isFavorite: Boolean(getRandomNumber(1)),
  type: getRandomArrayElement(POINT_TYPES)
});

const points = Array.from({length: NUMBER_POINTS_CREATED}, createPoint);

export {points};
