import {FilterType} from '../constant.js';

export const getFilterCounts = (movies) => {

  const filterCounts = {
    [FilterType.WATCHLIST]: 0,
    [FilterType.HISTORY]: 0,
    [FilterType.FAVORITES]: 0,
  };

  for (const it of movies) {
    if (it.userDetails.watchlist) {
      filterCounts[FilterType.WATCHLIST] ++;
    }
    if (it.userDetails.alreadyWatched) {
      filterCounts[FilterType.HISTORY] ++;
    }
    if (it.userDetails.favorite) {
      filterCounts[FilterType.FAVORITES] ++;
    }
  }

  return filterCounts;
};

export const getFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return movies.filter((movie) => movie.userDetails.watchlist === true);
    case FilterType.HISTORY:
      return movies.filter((movie) => movie.userDetails.alreadyWatched === true);
    case FilterType.FAVORITES:
      return movies.filter((movie) => movie.userDetails.favorite === true);
    default:
      return movies;
  }
};

