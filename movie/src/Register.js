import React, { useState } from "react";
import './login.css'
import { Link } from "react-router-dom";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      headers: {
        "Content-Type": "application/json",
      },
      //convert email and password to a json string
      body: JSON.stringify({
        fname: firstName,
        lname: lastName,
        email: email,
        password: password,
      }),
    };
    fetch("/register", options)
      .then(response=> response.json())
      .then(message=> {
        console.log(message)
    })
      //log error
      .catch((error) => {
        console.error("There was an error: ", error);
      });
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
            <h1> Register </h1>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)
            }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* pass  password value in useState hook aboce using setEmail */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login__button" onClick={handleRegister}>
              Register
            </button>
            <div className="register">
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                <span>
                  Already have an account? <b>Log in here!</b>
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
