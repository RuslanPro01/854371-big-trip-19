import dayjs from 'dayjs';
import {
  DateFormat,
  Minutes,
  TimeUnits
} from './const.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const getRandomPrice = (maxPrice) => Math.floor(Math.random() * maxPrice / 100) * 100;
const getRandomNumber = (number) => Math.round(Math.random() * number);
let dateFrom = '';
const RandomPointDate = {
  GET_DATE_FROM() {
    dateFrom = dayjs().subtract(getRandomNumber(8), 'days').subtract(getRandomNumber(1000), 'minute');

    return dateFrom.toISOString();
  },
  GET_DATE_TO() {
    return dateFrom.add(getRandomNumber(3), 'day').add(getRandomNumber(1000), 'minute').toISOString();
  }
};

const makeCapitalizeFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);
const getRandomArrayElement = (array) => array[getRandomNumber(array.length - 1)];
const getRandomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getFormatDate = (date, format = DateFormat.HUMANIZE) => date ? dayjs(date).format(format) : '';
const getDifferenceConventionalUnits = (dayTo, dayForm, units) => dayjs(dayTo).diff(dayjs(dayForm), units);

const getHumanizeDiffTime = (dayTo, dayForm) => {
  const diffMinutes = getDifferenceConventionalUnits(dayTo, dayForm, TimeUnits.MINUTE);
  const durationTime = dayjs.duration(diffMinutes, 'minutes');

  if (diffMinutes < Minutes.IN_HOUR) {
    return durationTime.format(DateFormat.SHORT_TIME);
  }

  if (diffMinutes >= Minutes.IN_HOUR && diffMinutes < Minutes.IN_DAY) {
    return durationTime.format(DateFormat.AVERAGE_TIME);
  }

  return durationTime.format(DateFormat.LURGE_TIME);
};

export {
  makeCapitalizeFirstLetter,
  getRandomPrice,
  getRandomArrayElement,
  RandomPointDate,
  getRandomNumber,
  getRandomIntFromInterval,
  getHumanizeDiffTime,
  getFormatDate
};
