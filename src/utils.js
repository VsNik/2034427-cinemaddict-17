import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const DATE_STRING_FORMAT = 'D MMMM YYYY';

export const getRelativeDateFromNow = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

export const formattingDuration = (duration) =>
  `${Math.floor(duration / 60)}h ${duration % 60}m`;


export const convertDateToString = (date) =>
  dayjs(date).format(DATE_STRING_FORMAT);
