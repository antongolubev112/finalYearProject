import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";

export const Recommendations = () => {
  const user = useSelector(selectUser);
  const token = sessionStorage.getItem("token");

  const fetchRecs = async () => {
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

    const response = await fetch(`/recommend`, options);
    const json = await response.json();
    console.log(json);
    if (response.status === 200) {
      console.log(Object.values(json));
      return json;
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);
  return (
    <div>
      <span className="LikedMovies__Title"> Favorite Movies </span>
    </div>
  );
};
