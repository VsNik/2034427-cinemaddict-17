import ApiService from '../framework/api-service.js';
import {adaptToServer} from '../adapter.js';

const Methods = {
  GET: 'GET',
  PUT: 'PUT',
};

const URL = 'movies';
const ContentType = {'Content-Type': 'application/json'};

export default class MovieApiService extends ApiService {

  get movies() {
    return this._load({url: URL})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `${URL}/${movie.id}`,
      method: Methods.PUT,
      body: JSON.stringify(adaptToServer(movie)),
      headers: new Headers(ContentType),
    });

    return  await ApiService.parseResponse(response);
  };
}
