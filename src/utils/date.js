import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

const DATE_FORMAT = 'YYYY';
const DATE_STRING_FORMAT = 'D MMMM YYYY';
const TIME_METRIC = 'minutes';

const DurationTemplates = {
  MINUTES: 'm[m]',
  HOURS: 'H[h]',
  HOURS_AND_MINUTES: 'H[h] m[m]'
};

export const getDateYear = (isoDate) => dayjs(isoDate).format(DATE_FORMAT);

export const getRelativeDateFromNow = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

export const formattingDuration = (runtime) => {
  dayjs.extend(duration);
  const timeDuration = dayjs.duration(runtime, TIME_METRIC);

  if ((runtime / 60) < 1) {
    return  timeDuration.format(DurationTemplates.MINUTES);
  }

  if ((runtime % 60) === 0) {
    return timeDuration.format(DurationTemplates.HOURS);
  }

  return timeDuration.format(DurationTemplates.HOURS_AND_MINUTES);
};

export const convertDateToString = (date) =>
  dayjs(date).format(DATE_STRING_FORMAT);

