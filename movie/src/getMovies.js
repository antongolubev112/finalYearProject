import React from "react";
import { Link } from "react-router-dom";
import "./getMovies.css";

export const GetMovies = ({ listOfMovies }) => {
  return (
    <>
      <div className="getMovie">
        <div className="movie__list">
          {listOfMovies.map((movie) => {
            return (
              <ul key={movie.id}>
                <Link to={`${movie.id}`}>
                  {movie.movieId}
                  <strong>{movie.title}</strong>
                  <br />
                  Imdb Score: {movie.imdbScore}
                  <br />
                  <img src={movie.posterUrl}></img>
                      
                  <br></br>
                </Link>
              </ul>
            );
          })}
        </div>
      </div>
    </>
  );
};
