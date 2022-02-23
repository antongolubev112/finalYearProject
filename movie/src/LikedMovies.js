import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";
import { useEffect, useState } from "react";

export const LikedMovies = () => {
  const user = useSelector(selectUser);
  //const [token, setToken] = useState();
  const [likes, setLikes] = useState();
  const token = sessionStorage.getItem("token");

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
        console.log(Object.values(json))
      setLikes(json)
      return json;
    }
  };

  const fetchMovies = async () => {
      const {data}=axios.all(likes.map(u => axios.get(`https://api.themoviedb.org/3/movie/${u.id}?api_key=${process.env.REACT_APP_API}`)))
      .then(axios.spread((...res) => {
          console.log(res);
        }));
    //console.log("fetch movies called");
  };

  useEffect(() => {
    if (user != null) {
      fetchLikes(); 
    }
    //setToken(sessionStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if(likes!=null){
        fetchMovies();
    }
  }, [likes]);

  return (
    <div>
      <span className="LikedMovies__Title"> Favorite Movies </span>
    </div>
  );
};
