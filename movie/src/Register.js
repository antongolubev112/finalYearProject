import React, { useState } from "react";
import "./login.css";
import { Link , Navigate} from "react-router-dom";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError]= useState("")

  const handleRegister = async () => {
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
    try {
      const response = await fetch("/register", options);
      const json = await response.json();
      if (response.status === 200) {
       <Navigate to={'/'} />;
        return json;
      }
      else {
        //set error passed from api 
        setRegisterError(json.msg)
      } 
      console.log(json);
    } catch (error) {
      //log error
      console.error("There was an error: ", error);
    }
  };

  return (
    <div>
      <div className="login">
        <div className="login__container">
          {/* pass email value in useState hook aboce using setEmail */}
          <form className="login__form">
            <h1> Register </h1>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
            <div className="login__error">{registerError}</div>
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
