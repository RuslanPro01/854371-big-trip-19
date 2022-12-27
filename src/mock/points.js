import {
  getRandomNumber,
  RandomPointDate,
  getRandomPrice,
  getRandomArrayElement,
  getRandomIntFromInterval
} from '../utils/utils-mock.js';
import {
  MAX_PRICE,
  NUMBER_POINTS_CREATED,
  POINT_TYPES
} from '../const.js';
let pointId = 1;

const getNumbersCheckedOffers = () => {
  const checkedOffers = new Set();
  for (let i = 0; i < getRandomIntFromInterval(1, 6); i++) {
    checkedOffers.add(getRandomIntFromInterval(1, 6));
  }
  return Array.from(checkedOffers);
};

const createPoint = () => ({
  basePrice: getRandomPrice(MAX_PRICE),
  dayFrom: RandomPointDate.GET_DATE_FROM(),
  dayTo: RandomPointDate.GET_DATE_TO(),
  destination: [pointId],
  offers: getNumbersCheckedOffers(),
  id: pointId++,
  isFavorite: Boolean(getRandomNumber(1)),
  type: getRandomArrayElement(POINT_TYPES)
});

const points = Array.from({length: NUMBER_POINTS_CREATED}, createPoint);

export {points};
