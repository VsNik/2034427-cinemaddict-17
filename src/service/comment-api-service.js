import ApiService from '../framework/api-service.js';

const Methods = {
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentApiService extends ApiService {

  getComments = (movieId) =>
    this._load({url: `comments/${movieId}`})
      .then(ApiService.parseResponse);

  addComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.movieId}`,
      method: Methods.POST,
      body: JSON.stringify(comment.newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };


  deleteComment = async (commentId) =>
    await this._load({
      url: `comments/${commentId}`,
      method: Methods.DELETE,
    });
}
