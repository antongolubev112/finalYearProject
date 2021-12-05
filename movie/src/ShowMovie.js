import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./showMovie.css";

export const ShowMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    //fetch from /movie with a given id
    fetch(`/movie/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data));
    //if id changes, make new request
  }, [id]);

  return (
    <div>
      {movie.length > 0 &&
        movie.map((data) => (
          <div className="movie">
            <div className="movie__container">
              <img src={data.posterUrl} />
              <div className="movie__details">
                <h1>{data.title}</h1>
                <h4>Rotten Tomatoes Score:</h4>{data.rtScore}
                <h4>IMDB Score:</h4>{data.imdbScore}
                <h4>Age Rating:</h4>{data.rating}
                <h4>Run TIme:</h4>{data.runtime}
                <h4>Studio:</h4>{data.studio}
                <h4>Box Office Numbers:</h4>{data.boxOffice}
                <h4>Release Date:</h4>{data.releaseDate}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
