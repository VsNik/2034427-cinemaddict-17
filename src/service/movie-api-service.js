import ApiService from '../framework/api-service.js';
import {adaptToServer} from '../adapter.js';

const Methods = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MovieApiService extends ApiService {

  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Methods.PUT,
      body: JSON.stringify(adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return  await ApiService.parseResponse(response);
  };
}
