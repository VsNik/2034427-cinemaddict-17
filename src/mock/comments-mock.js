import {mockActors, mockPhrases} from './data-mock.js';
import {getRandomElement, getRandomPastDate} from './utils-mock.js';

const EMOJI = ['angry', 'puke', 'sleeping', 'smile'];

const createCommentItem = (commentId) => (
  {
    id: commentId,
    emoji: getRandomElement(EMOJI),
    text: getRandomElement(mockPhrases),
    author: getRandomElement(mockActors),
    date: getRandomPastDate(3),
  }
);


export const createComments = (ids) => ids.map((id) => createCommentItem(id));
