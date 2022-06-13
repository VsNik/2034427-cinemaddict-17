import {sortByComments, sortByRating, randomSort} from './sorting.js';

export const getTopRated = (movies, count) => {
  const ratedMovies = sortByRating(movies).slice(0, count);

  if (ratedMovies[0].filmInfo.totalRating === ratedMovies[count - 1].filmInfo.totalRating) {
    return randomSort(ratedMovies);
  }

  return ratedMovies;
};

export const getTopCommentsCount = (movies, count) => {
  const commentedMovies = sortByComments(movies).slice(0, count);

  if (commentedMovies[0].comments.length === commentedMovies[count - 1].comments.length) {
    return randomSort(commentedMovies);
  }

  return commentedMovies;
};
