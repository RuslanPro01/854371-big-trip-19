import dayjs from 'dayjs';

export const isBeforeTime = (date) => dayjs(date).isBefore(dayjs(), 'd');
export const isAfterTime = (date) => dayjs(date).isAfter(dayjs(), 'd');
export const isSameTime = (date) => dayjs(date).isSame(dayjs(), 'd');
