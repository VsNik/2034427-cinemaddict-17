import {FilterNames} from '../constant.js';

export const getFilters = (movies) => {

  const filterCounts = {
    [FilterNames.WATCHLIST]: 0,
    [FilterNames.HISTORY]: 0,
    [FilterNames.FAVORITES]: 0,
  };

  for (const it of movies) {
    if (it.userDetails.watchlist) {
      filterCounts[FilterNames.WATCHLIST] ++;
    }
    if (it.userDetails.alreadyWatched) {
      filterCounts[FilterNames.HISTORY] ++;
    }
    if (it.userDetails.favorite) {
      filterCounts[FilterNames.FAVORITES] ++;
    }
  }

  return filterCounts;
};
