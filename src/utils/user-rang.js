import {UserRang} from '../constant.js';

export const getUserRang = (movies) => {
  const watched = movies.filter((it) => it.userDetails.alreadyWatched);
  const watchedCount = watched.length;

  if (watchedCount === 0) {
    return '';
  }
  if (watchedCount >= 1 && watchedCount <= 10) {
    return UserRang.NOVICE;
  }
  if (watchedCount >= 11 && watchedCount <= 20) {
    return UserRang.FAN;
  }
  if (watchedCount >= 21) {
    return UserRang.MOVIE_BUFF;
  }
};

