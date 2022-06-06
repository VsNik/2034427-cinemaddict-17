import Observable from '../framework/observable.js';
import {adaptToClient} from '../adapter.js';

export default class CommentsModel extends Observable {

  #comments = [];
  #commentedMovie = null;
  #commentsApiService = null;
  #changeData;

  constructor(commentsApiService, changeData) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#changeData = changeData;
  }

  init = async (movieId) => {
    try {
      const response = await this.#commentsApiService.getComments(movieId);
      this.#comments = response;
      return response;
    } catch (err) {
      this.#comments = [];
    }
  };

  get comments() {
    return this.#comments;
  }

  get commentedMovie() {
    return this.#commentedMovie;
  }

  removeComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update.commentId);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this.#commentedMovie = update.updateMovie;
      this.#changeData(this.#commentedMovie);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update);
      this.#comments = response.comments;
      this.#commentedMovie = adaptToClient(response.movie);
      this.#changeData(this.#commentedMovie);
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };
}
