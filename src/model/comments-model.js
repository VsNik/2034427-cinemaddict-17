import Observable from '../framework/observable.js';
import {createComments} from '../mock/comments-mock.js';

export default class CommentsModel extends Observable {

  #comments = createComments();

  getCommentsByIds(movieIds) {
    return this.#comments.filter((it) => movieIds.includes(it.id));
  }

  removeComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments
    ];

    this._notify(updateType, update);
  };
}
