import {FilterTypes} from '../constant.js';

export const getFilterCounts = (movies) => {

  const filterCounts = {
    [FilterTypes.WATCHLIST]: 0,
    [FilterTypes.HISTORY]: 0,
    [FilterTypes.FAVORITES]: 0,
  };

  for (const it of movies) {
    if (it.userDetails.watchlist) {
      filterCounts[FilterTypes.WATCHLIST] ++;
    }
    if (it.userDetails.alreadyWatched) {
      filterCounts[FilterTypes.HISTORY] ++;
    }
    if (it.userDetails.favorite) {
      filterCounts[FilterTypes.FAVORITES] ++;
    }
  }

  return filterCounts;
};

export const getFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterTypes.WATCHLIST:
      return movies.filter((movie) => movie.userDetails.watchlist === true);
    case FilterTypes.HISTORY:
      return movies.filter((movie) => movie.userDetails.alreadyWatched === true);
    case FilterTypes.FAVORITES:
      return movies.filter((movie) => movie.userDetails.favorite === true);
    default:
      return movies;
  }
};

