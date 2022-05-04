export default class SortingExtra {

  #moviesClone = [];
  #sortedMovies = [];

  constructor(movies) {
    this.#moviesClone = movies.slice();
  }

  sortByBating = (showCount = null) => {
    const result = this.#sortBy(showCount, this.#onRatingSort);
    return result.filter((it)=> it.filmInfo.totalRating !== 0);
  };

  sortByCommentsCount = (showCount = null) => {
    const result = this.#sortBy(showCount, this.#onCommentsCountSort);
    return result.filter((it) => it.comments.length !== 0);
  };

  #sortBy = (showCount, callback) => {
    const count = this.#getCount(showCount);

    Array(count).fill('').forEach(() => {
      const indexMaxValue = this.#moviesClone.reduce(callback, 0);
      this.#sortedMovies.push(this.#moviesClone[indexMaxValue]);
      this.#moviesClone.splice(indexMaxValue, 1);
    });

    return this.#sortedMovies;
  };

  #getCount = (showCount) => this.#moviesClone.length < showCount ? this.#moviesClone.length : showCount;

  #onRatingSort = (prev, current, index, array) => current.filmInfo.totalRating > array[prev].filmInfo.totalRating ? index : prev;

  #onCommentsCountSort = (prev, current, index, array) => current.comments.length > array[prev].comments.length ? index : prev;
}
