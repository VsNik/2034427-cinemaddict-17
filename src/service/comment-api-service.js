import ApiService from '../framework/api-service.js';

const Methods = {
  POST: 'POST',
  DELETE: 'DELETE',
};

const URL = 'comments';
const ContentType = {'Content-Type': 'application/json'};

export default class CommentApiService extends ApiService {

  getComments = (movieId) =>
    this._load({url: `${URL}/${movieId}`})
      .then(ApiService.parseResponse);

  addComment = async (comment) => {
    const response = await this._load({
      url: `${URL}/${comment.movieId}`,
      method: Methods.POST,
      body: JSON.stringify(comment.newComment),
      headers: new Headers(ContentType),
    });

    return await ApiService.parseResponse(response);
  };


  deleteComment = async (commentId) =>
    await this._load({
      url: `${URL}/${commentId}`,
      method: Methods.DELETE,
    });
}
