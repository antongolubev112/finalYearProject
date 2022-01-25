import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useNavigate();
  // const [nameError,setNameError]= useState('');

  //access token
  const token = sessionStorage.getItem("token");

  const validate = () => {
    let emailError = "";
    let passError = "";

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email!");
    }

    //if email error is not empty
    if (emailError) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      console.log("Not valid");
    }
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

    //fetch from /token and pass in options
    if (isValid) {
      try {
        console.log("is valid");
        const response = await fetch("/token", options);
        const json = await response.json();
        if (response.status === 200) return json;
        else{
          //set error passed from api 
          setLoginError(json.msg)
        } 

        //store access token fetched from the backend
        console.log("retrieved token from backend: ", json.access_token);
        sessionStorage.setItem("token", json.access_token);
        history.push("/");
        setEmail("");
        setPassword("");
      } catch (error) {
        //log error
        console.error("There was an error: ", error);
      }
    }
  };

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
            <div className="login__error">{emailError}</div>
            <div className="login__error">{loginError}</div>
            {/* pass  password value in useState hook aboce using setEmail */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login__error">{passError}</div>
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
