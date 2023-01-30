import dayjs from 'dayjs';
import {
  DateFormat,
} from '../const.js';


export const getFormatDate = (date, format = DateFormat.HUMANIZE) => date ? dayjs(date).format(format) : '';
