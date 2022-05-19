import dayjs from 'dayjs';

export const sortByRating = (movies) =>
  movies.sort((movieA, movieB) => movieB.filmInfo.totalRating - movieA.filmInfo.totalRating);

export const sortByDate = (movies) =>
  movies.sort((movieA, movieB) => dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date)));

export const sortByComments = (movies) =>
  movies.sort((movieA, movieB) => movieB.comments.length - movieA.comments.length);

