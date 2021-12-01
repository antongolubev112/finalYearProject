import React, { useState, useEffect } from "react";
import { GetMovies } from "./getMovies";
//import "./movie.css"

export const Movies = () => {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    //fetch from api
    fetch("/movies")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => setMovie(data));
  }, []);

  return (
    <>
      <GetMovies listOfMovies={movie} />
    </>
  );
};
