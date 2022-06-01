import {getFilterCounts} from '../utils/filter.js';

export const createFilters = (movies) => {

  const filters = getFilterCounts(movies);

  return Object.keys(filters).map((name) => ({name, count: filters[name]}));
};

