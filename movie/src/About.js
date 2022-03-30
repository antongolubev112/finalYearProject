import "./about.css";
export const About = () => {
  return (
    <div className="About">
      <div className="About__Title">About This Application</div>
      <div>
        This application recommends movies by comparing features of movies you
        like to features of movies in our internal database.
      </div>

      <div className="About__List">
        <ol>
          <span className="About__How">How to use this website:</span>
          <li>Register an account</li>
          <li>Log in</li>
          <li>
            Find a movie you like by either exploring the all movies/top rated
            tab or by using the search tab
          </li>
          <li>Like that movie</li>
          <li>Go to the Recommendations and press refresh</li>
          <li>Wait for our algorithm to give you suggestions</li>
          <li>
            Anytime you add a movie(s) to your likes, you must hit refresh
          </li>
        </ol>
      </div>
      <img
          className="navbar__logo"
          src="https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
        />
      <div className="About__Credits">
        <div className="About__CreditsTitle">Credits</div>
        All images in this application belong to The Movie DataBase(TMDB). All
        movie information is also provided by TMDB. TMDB is a community built
        movie and TV database that is maintained by its users. It can be found
        here <a href="https://www.themoviedb.org/">TMDB</a>
        <span>While this application uses the TMDB API, it is not endorsed or certified by TMDB.</span>
      </div>
    </div>
  );
};
