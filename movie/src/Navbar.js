import React, { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";
import { logout } from "./state/userSlice";

function Header() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    dispatch(logout());
  };

  useEffect(() => {}, [user]);
  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <img
          className="navbar__logo"
          src="https://images.creativemarket.com/0.1.0/ps/7414066/1820/1214/m1/fpnw/wm1/logo-design-for-movie-production-company-01-.jpg?1575502358&s=c37b3e6a8863b415070b669f6c8a457c"
        />
      </Link>

      <div className="navbar__buttons">
        <Link to="/" style={{ textDecoration: "none" }} color="white">
          <div className="navbar__option">
            <span className="navbar__optionLineTwo">All Movies</span>
          </div>
        </Link>

        <Link to="/top" style={{ textDecoration: "none" }} color="white">
          <div className="navbar__option">
            <span className="navbar__optionLineTwo">Top Rated</span>
          </div>
        </Link>

        {user ? (
          <Link to="/likes" style={{ textDecoration: "none" }} color="white">
            <div className="navbar__option">
              <span className="navbar__optionLineTwo">Liked Movies</span>
            </div>
          </Link>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }} color="white">
            <div className="navbar__option">
              <span className="navbar__optionLineTwo">Liked Movies</span>
            </div>
          </Link>
        )}

        <Link to="/recommend" style={{ textDecoration: "none" }} color="white">
          <div className="navbar__option">
            <span className="navbar__optionLineTwo">Recommendations</span>
          </div>
        </Link>
      </div>
      <Link to="/search" style={{ textDecoration: "none" }} color="white">
        <div className="navbar__option">
          {/* Search icon */}
          <span className="navbar__optionLineTwo">Search</span>
        </div>
      </Link>

      {user ? (
        <div className="navbar__option">
          <span
            onClick={(e) => handleLogout(e)}
            className="navbar__optionLineTwo"
          >
            Sign out
          </span>
        </div>
      ) : (
        <Link to="/login" style={{ textDecoration: "none" }} color="white">
          <div className="navbar__option">
            <span className="navbar__optionLineTwo">Sign in</span>
          </div>
        </Link>
      )}

      {user ? (
        <div className="navbar__option">
          <span className="navbar__optionLineOne">Hello {user.fname}</span>
          <span className="navbar__optionLineTwo">Your Account</span>
        </div>
      ) : (
        <div className="navbar__option">
          <span className="navbar__optionLineOne">Your</span>

          <span className="navbar__optionLineTwo">Account</span>
        </div>
      )}
    </div>
  );
}

export default Header;
