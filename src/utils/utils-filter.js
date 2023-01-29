import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isBeforeTime = (date) => dayjs(date).isBefore(dayjs(), 'd');
const isAfterTime = (date) => dayjs(date).isAfter(dayjs(), 'd');
const isSameTime = (date) => dayjs(date).isSame(dayjs(), 'd');

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(({dayFrom}) => isAfterTime(dayFrom)),
  [FilterType.PRESENT]: (points) => points.filter(({dayFrom, dayTo}) => (isBeforeTime(dayFrom) || isSameTime(dayFrom)) && (isAfterTime(dayTo) || isSameTime(dayTo))),
  [FilterType.PAST]: (points) => points.filter(({dayTo}) => isBeforeTime(dayTo))
};
