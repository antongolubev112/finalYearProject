import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {login} from "./state/userSlice";
import "./login.css";
import userLikesService from "./userLikesService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch= useDispatch();

  //access token
  const token = sessionStorage.getItem("token");

  const handleLogin = async (e) => {
    //prevent page refresh
    e.preventDefault();

    //options to send along side the request
    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      headers: {
        "Content-Type": "application/json",
      },
      //convert email and password to a json string
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };


    //send request from /token endpoiint in api and pass options with the request
      try {
        const response = await fetch("/token", options);
        const json = await response.json();
        console.log(response);
        if (response.status === 200) {
          console.log("retrieved token from backend: ", json.token);
          console.log("User details: ",json.fname," ",json.lname," ",json.email)

          //store access token fetched from the backend
          sessionStorage.setItem("token", json.token);

          //fetch the logged in user's likes
          const likes= await userLikesService(json.token);
          console.log("likes: ",likes)
          setEmail("");
          setPassword("");

          //redirect to homepage
          navigate("/");
          
          //dispatch user state to redux
          dispatch(
            login({
              fname:json.fname,
              lname:json.lname,
              email:json.email,
              token:json.token,
              likes:likes,
              loggedIn: true,
          }));

          return json;
        }
        else{
          //set error passed from api 
          setLoginError(json.msg)
        } 

        
       
      } catch (error) {
        //log error
        console.error("There was an error: ", error);
      }
  };

  useEffect(()=>{
    setEmail("");
    setPassword("");
  },[]);
    
  return (
    <div>
      {/* If token exists and is not empty/or undefined then say you are logged in
      {token && token != " " && token != undefined ? (
        "You are logged in with this token " + token
      ) : (
        //if not logged in go to email form */}
      <div className="login">
        <div className="login__container">
          {/* pass email value in useState hook aboce using setEmail */}
          <form className="login__form">
            <h1> Sign in </h1>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="login__error">{loginError}</div>
            {/* pass  password value in useState hook aboce using setEmail */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login__button" onClick={handleLogin}>
              Login
            </button>
            <div className="register">
              <Link
                to="/register"
                style={{ color: "white", textDecoration: "none" }}
              >
                <span>
                  New to Mov.ie? <b>Sign up now!</b>
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
