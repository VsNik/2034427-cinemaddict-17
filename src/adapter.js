export const adaptToClient = (movie) => {
  const adaptedFilmInfo = {...movie['film_info'],
    alternativeTitle: movie['film_info']['alternative_title'],
    ageRating: movie['film_info']['age_rating'],
    totalRating: movie['film_info']['total_rating'],
    release: {
      ...movie['film_info']['release'],
      releaseCountry: movie['film_info']['release']['release_country']
    }
  };

  const adaptedUserDetails = {...movie['user_details'],
    alreadyWatched: movie['user_details']['already_watched'],
    watchingDate: movie['user_details']['watching_date'],
  };

  const adaptedMovie = {...movie,
    filmInfo: adaptedFilmInfo,
    userDetails: adaptedUserDetails
  };

  delete adaptedMovie['film_info'];
  delete adaptedMovie.filmInfo['alternative_title'];
  delete adaptedMovie.filmInfo['age_rating'];
  delete adaptedMovie.filmInfo['total_rating'];
  delete adaptedMovie.filmInfo.release['release_country'];
  delete adaptedMovie['user_details'];
  delete adaptedMovie.userDetails['already_watched'];
  delete adaptedMovie.userDetails['watching_date'];

  return adaptedMovie;
};

export const adaptToServer = (movie) => {

  const adaptedFilmInfo = {...movie.filmInfo,
    'alternative_title': movie.filmInfo.alternativeTitle,
    'age_rating': movie.filmInfo.ageRating,
    'total_rating': movie.filmInfo.totalRating,
    release: {
      ...movie.filmInfo.release,
      'release_country': movie.filmInfo.release.releaseCountry
    },
  };

  const adaptedUserDetails = {...movie.userDetails,
    'already_watched': movie.userDetails.alreadyWatched,
    'watching_date': movie.userDetails.watchingDate,
  };

  const adaptedMovie = {...movie,
    'film_info': adaptedFilmInfo,
    'user_details': adaptedUserDetails
  };

  delete adaptedMovie.filmInfo;
  delete adaptedMovie.film_info.alternativeTitle;
  delete adaptedMovie.film_info.ageRating;
  delete adaptedMovie.film_info.totalRating;
  delete adaptedMovie.film_info.release.releaseCountry;
  delete adaptedMovie.userDetails;
  delete adaptedMovie.user_details.alreadyWatched;
  delete adaptedMovie.user_details.watchingDate;

  return adaptedMovie;
};
