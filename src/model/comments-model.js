import {createComments} from '../mock/comments-mock.js';

export default class CommentsModel {

  #comments = createComments();

  getCommentsByIds(movieIds) {
    return this.#comments.filter((it) => movieIds.includes(it.id));
  }
}
