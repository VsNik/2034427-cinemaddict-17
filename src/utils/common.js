import he from 'he';
import dayjs from 'dayjs';

const SCROLL_HIDDEN_CLASS = 'hide-overflow';

export const encodeText = (text) => he.encode(text);

export const hideScroll = (element) => element.classList.add(SCROLL_HIDDEN_CLASS);

export const showScroll = (element) => element.classList.remove(SCROLL_HIDDEN_CLASS);

export const sortByDateDesc = (objectsList) =>
  objectsList.sort((objA, objB) => dayjs(objB.date).diff(dayjs(objA.date)));
