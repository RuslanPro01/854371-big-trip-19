import {RandomPointDate} from './utils/utils-mock.js';
export const DateFormat = {
  HUMANIZE: 'MMM D',
  INTERNATIONAL: 'YYYY-MM-DD',
  INTERNATIONAL_WITH_TIME: 'DD/MM/YY HH:mm',
  SHORT_TIME: 'm[M]',
  AVERAGE_TIME: 'HH[H] mm[M]',
  LURGE_TIME: 'DD[D] HH[H] mm[M]',
  LOCAL_TIME: 'HH:mm'
};

export const DEFAULT_TRIP_TYPE = 'taxi';

export const Minutes = {
  IN_HOUR: 60,
  IN_DAY: 1440,
};

export const TimeUnits = {
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second'
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export const SortType = {
  DEFAULT: 'default',
  DURATION: 'duration',
  PRICE: 'price'
};

export const BLANK_POINT = {
  basePrice: '',
  dayFrom: RandomPointDate.GET_DATE_FROM(),
  dayTo: RandomPointDate.GET_DATE_TO(),
  destination: 1,
  offers: [],
  type: DEFAULT_TRIP_TYPE,
  isFavorite: false
};

export const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};
