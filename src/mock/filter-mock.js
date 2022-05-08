import {getFilters} from '../utils/filter.js';

export const createFilters = (movies) => {

  const filters = getFilters(movies);

  return Object.keys(filters).map((name) => ({name, count: filters[name]}));
};

