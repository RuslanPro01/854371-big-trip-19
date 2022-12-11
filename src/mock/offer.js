import {
  getRandomArrayElement,
  getRandomNumber
} from '../utils.js';
import {
  MAX_OFFER_PRICE,
  NUMBER_POINTS_CREATED,
  OFFERS_DESCRIPTIONS
} from '../const.js';

let offerId = 1;
const createOffer = () => ({
  id: offerId++,
  title: getRandomArrayElement(OFFERS_DESCRIPTIONS),
  price: getRandomNumber(MAX_OFFER_PRICE)
});

const offers = Array.from({length: NUMBER_POINTS_CREATED}, createOffer);

export {offers};
