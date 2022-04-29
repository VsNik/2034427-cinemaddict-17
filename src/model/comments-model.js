import {createComments} from '../mock/comments-mock.js';

export default class CommentsModel {

  getComments(movie) {
    this.comments = createComments(movie.comments);

    return this.comments;
  }
}
