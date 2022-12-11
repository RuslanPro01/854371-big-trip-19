import dayjs from 'dayjs';
import {MAX_OFFER_PRICE} from './const.js';

const getRandomPrice = (maxPrice) => Math.floor(Math.random() * maxPrice / 100) * 100;
const getRandomNumber = (number) => Math.round(Math.random() * number);
let dateFrom = '';
const RandomPointDate = {
  GET_DATE_FROM() {
    dateFrom = dayjs().subtract(getRandomNumber(8), 'days');

    return dateFrom.toISOString();
  },
  GET_DATE_TO() {
    return dateFrom.add(getRandomNumber(MAX_OFFER_PRICE), 'day').toISOString();
  }
};

const getRandomArrayElement = (array) => array[getRandomNumber(array.length - 1)];

export {
  getRandomPrice,
  getRandomArrayElement,
  RandomPointDate,
  getRandomNumber
};
