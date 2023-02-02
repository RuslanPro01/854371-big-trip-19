import dayjs from 'dayjs';

export const getRandomNumber = (number) => Math.round(Math.random() * number);
let dateFrom = '';
export const RandomPointDate = {
  GET_DATE_FROM() {
    dateFrom = dayjs().add(getRandomNumber(3), 'days').subtract(getRandomNumber(1000), 'minute');

    return dateFrom.toISOString();
  },
  GET_DATE_TO() {
    return dateFrom.add(getRandomNumber(3), 'day').add(getRandomNumber(1000), 'minute').toISOString();
  }
};
