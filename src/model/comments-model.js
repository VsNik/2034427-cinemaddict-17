import Observable from '../framework/observable.js';
import {createComments} from '../mock/comments-mock.js';

export default class CommentsModel extends Observable {

  #comments = createComments();

  getCommentsByIds(movieIds) {
    return this.#comments.filter((it) => movieIds.includes(it.id));
  }
}
