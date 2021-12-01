import React from "react";

export const GetMovies = ({ listOfMovies }) => {
  return (
    <>
      {listOfMovies.map((movie) => {
        return (
          <div>
            <strong>{movie.title}</strong>
            <br />
            Imdb Score: {movie.imdbScore}
            <br />
            <img src={movie.posterUrl}></img>
          </div>
        );
      })}
    </>
  );
};
