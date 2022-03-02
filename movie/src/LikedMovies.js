import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";
import { useEffect, useState } from "react";
import "./movielist.css"
import { SingleMovie } from "./SingleMovie";
import userLikesService from "./userLikesService";

export const LikedMovies = () => {
  const user = useSelector(selectUser);
  //const [token, setToken] = useState();
  const [likes, setLikes] = useState();
  const token = sessionStorage.getItem("token");
  const [movies,setMovies]= useState();

  const fetchLikes = async () => {
    console.log(user.email);
    console.log("token ", token);
    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      //convert email and password to a json string
    };

    const response = await fetch(`/getLikes`, options);
    const json = await response.json();
    console.log(json);
    if (response.status === 200) {
      console.log(Object.values(json));
      setLikes(json);
      return json;
    }
  };

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
    //console.log("fetch movies called");
  };

  //if user is logged in then fetch the ids of the liked movies from postgres
  useEffect(() => {
    if (user != null) {
      userLikesService(token).then((res)=>setLikes(res));
    }
    //setToken(sessionStorage.getItem("token"));
  }, []);

  //if likes isn't null then fetch movie details from TMDB.
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
