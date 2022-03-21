import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";
import { useEffect, useState } from "react";
import "./movielist.css"
import "./likedmovies.css"
import { SingleMovie } from "./SingleMovie";
import userLikesService from "./userLikesService";

export const LikedMovies = () => {
  const user = useSelector(selectUser);
  //const [token, setToken] = useState();
  const [likes, setLikes] = useState();
  const token = sessionStorage.getItem("token");
  const [movies,setMovies]= useState();

  const fetchMovies = async () => {
    //iterate through likes object to make concurrent requests
    const { data } = axios
      .all(
        likes.map((u) =>
          axios.get(
            `https://api.themoviedb.org/3/movie/${u.id}?api_key=${process.env.REACT_APP_API}`
          )
        )
      )
      //take the result of all of those requests and set it to movies
      .then(
        axios.spread((...res) => {
          console.log(res);
          setMovies(res);
        })
      );
  };

  //if user is logged in then fetch the ids of the liked movies from postgres
  useEffect(() => {
    if (user != null) {
      userLikesService(token).then((res)=>setLikes(res));
    }
    //setToken(sessionStorage.getItem("token"));
  }, []);

  //when likes change then fetch movie details from TMDB.
  useEffect(() => {
    if (likes != null) {
      fetchMovies();
    }
  }, [likes,user]);

  return (
    <div>
      <span className="LikedMovies__Title"> Favorite Movies </span>
      <div className="MovieList">
        {/* if content is not empty and  */}
        {movies &&
          movies.map((c) => (
            <SingleMovie
              key={c.data.id}
              id={c.data.id}
              poster={c.data.poster_path}
              title={c.data.title}
              date={c.data.release_date}
              vote_average={c.data.vote_average}
            />
          ))}
      </div>
    </div>
  );
};
