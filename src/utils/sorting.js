export const handleRatingSort = (prev, current, index, array) =>
  current.filmInfo.totalRating > array[prev].filmInfo.totalRating ? index : prev;

export const handleCommentsSort = (prev, current, index, array) =>
  current.comments.length > array[prev].comments.length ? index : prev;

export const handleDateSort = (prev, current, index, array) =>
  current.filmInfo.release.date > array[prev].filmInfo.release.date ? index : prev;


export const sort = (arrayObjects, callback, count) => {

  const cloneArrayObjects = [...arrayObjects];
  const sortedObjects = [];
  const length = cloneArrayObjects.length > count ? count : arrayObjects.length;

  while (sortedObjects.length !== length) {
    const indexMaxValue = cloneArrayObjects.reduce(callback, 0);
    sortedObjects.push(cloneArrayObjects[indexMaxValue]);
    cloneArrayObjects.splice(indexMaxValue, 1);
  }

  return sortedObjects;
};
