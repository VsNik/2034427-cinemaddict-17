import {generateRandomInt, getRandomElement, getRandomElements, getRandomPastDate} from './utils-mock.js';
import {mockPhrases, mockActors, mockDirectors, mockTitles, mockPosters} from './data-mock.js';

const GENRES = ['Musical', 'Drama', 'Film-Noir', 'Comedy', 'Adventure', 'Action', 'Fantasy'];
const COUNTRIES = ['Russia', 'Belarus', 'China', 'India', 'France', 'USA'];
const AGE_RATING = [0, 12, 16, 18];

const createMovieItem = () => (
  {
    comments: [1,2,3,4,5].slice(0, generateRandomInt(0, 5)),
    filmInfo: {
      title: getRandomElement(mockTitles),
      alternativeTitle: getRandomElement(mockTitles),
      totalRating: (Math.random() * 10).toFixed(1),
      poster: getRandomElement(mockPosters),
      ageRating: getRandomElement(AGE_RATING),
      director: getRandomElement(mockDirectors),
      writers: getRandomElements(mockActors, 2, 4),
      actors: getRandomElements(mockActors, 3, 5),
      release: {
        date: getRandomPastDate(),
        releaseCountry: getRandomElement(COUNTRIES),
      },
      runtime: generateRandomInt(60, 240),
      genre: getRandomElements(GENRES, 1, 3),
      description: getRandomElements(mockPhrases, 1, 5).join('.'),
    },
    userDetails: {
      watchlist: Math.random() > 0.5,
      alreadyWatched: Math.random() > 0.5,
      favorite: Math.random() > 0.5,
    }
  }
);

export const createMovies = (count) =>
  new Array(count).fill('').map(createMovieItem);
