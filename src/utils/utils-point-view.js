import {
  DateFormat,
  Minutes,
  TimeUnits
} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const makeCapitalizeFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);

const getDifferenceConventionalUnits = (dayTo, dayForm, units) => dayjs(dayTo).diff(dayjs(dayForm), units);

export const getHumanizeDiffTime = (dayTo, dayForm) => {
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

export const sortPriceDown = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortTimeDown = (pointA, pointB) => {
  const getPointDuration = (point) => getDifferenceConventionalUnits(point.dayTo, point.dayFrom, TimeUnits.SECOND);
  return getPointDuration(pointB) - getPointDuration(pointA);
};
