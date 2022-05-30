import {mockActors, mockPhrases} from './data-mock.js';
import {getRandomElement, getRandomPastDate} from './utils-mock.js';

export const COMMENTS_COUNT = 20;
const EMOJI = ['angry', 'puke', 'sleeping', 'smile'];

const createCommentItem = (commentId) => (
  {
    id: String(commentId),
    emotion: getRandomElement(EMOJI),
    comment: getRandomElement(mockPhrases),
    author: getRandomElement(mockActors),
    date: getRandomPastDate(3),
  }
);

export const createComments = () =>
  Array(COMMENTS_COUNT).fill('').map((_, index) => createCommentItem(index + 1));
