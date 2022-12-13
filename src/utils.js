import dayjs from 'dayjs';
import {MAX_OFFER_PRICE} from './const.js';

const getRandomPrice = (maxPrice) => Math.floor(Math.random() * maxPrice / 100) * 100;
const getRandomNumber = (number) => Math.round(Math.random() * number);
let dateFrom = '';
const RandomPointDate = {
  GET_DATE_FROM() {
    dateFrom = dayjs().subtract(getRandomNumber(8), 'days').subtract(getRandomNumber(1000), 'minute');

    return dateFrom.toISOString();
  },
  GET_DATE_TO() {
    return dateFrom.add(getRandomNumber(MAX_OFFER_PRICE), 'day').add(getRandomNumber(1000), 'minute').toISOString();
  }
};

const getRandomArrayElement = (array) => array[getRandomNumber(array.length - 1)];

const getRandomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export {
  getRandomPrice,
  getRandomArrayElement,
  RandomPointDate,
  getRandomNumber,
  getRandomIntFromInterval
};
