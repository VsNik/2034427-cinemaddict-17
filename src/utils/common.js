import he from 'he';
import dayjs from 'dayjs';

const SCROLL_HIDDEN_CLASS = 'hide-overflow';
const DEBOUNCE_TIMEOUT = 300;

export const encodeText = (text) => he.encode(text);

export const hideScroll = (element) => element.classList.add(SCROLL_HIDDEN_CLASS);

export const showScroll = (element) => element.classList.remove(SCROLL_HIDDEN_CLASS);

export const sortByDateDesc = (list) =>
  list.sort((objA, objB) => dayjs(objB.date).diff(dayjs(objA.date)));

export const debounce = (fn, timeout = DEBOUNCE_TIMEOUT) => {
  let timerId;
  return (...rest) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, rest), timeout);
  };
};
