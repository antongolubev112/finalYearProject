import axios from "axios";
import { useEffect, useState } from "react";
import { SingleMovie } from "./SingleMovie";
import "./movielist.css";
import useGenres from "./Hooks/useGenres";
import Genres from "./Genres";

export const Discover = () => {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  
  //send selected genres array to the useGenres hook
  //returns a list of genre ids that will be used in the api call
  const genresForApi=useGenres(selectedGenres);

  const updateMovies = async () => {
    //fetch movies from api
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API}&page=${page}&with_genres=${genresForApi}`
    );
    console.log(data);
    //append fetched movies to previously fetched movies
    
    setContent((previousContent) => [...previousContent, ...data.results]);
  };

  const moviesWithGenre = async () => {
    //fetch movies from api
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API}&page=${page}&with_genres=${genresForApi}`
    );
    console.log(data);
    //append fetched movies to previously fetched movies
    
    setContent(data.results);
  };

  console.log(genresForApi)
  //use effect runs after first render and after every update
  useEffect(() => {
    const onScroll = function () {
      //if user reaches bottom of page then fetch more movies
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        let newPage = page;
        console.log("page: " + page);
        newPage++;
        console.log("newPage: " + newPage);
        setPage(newPage);
        console.log("page: " + page);
      }
    };
    updateMovies();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    //fire every time page or genresForApi is updated
  }, [page]);

  useEffect(()=>{
    if(!selectedGenres.length==0){
      moviesWithGenre();
    }
    
  },[genresForApi]);
  return (
    <div>
      <span className="MovieList__Title"> </span>
      {/* Passing genre arrays to Genres component */}
      <Genres
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
      />
      <div className="MovieList">
        {/* if content is not empty and  */}
        {content &&
          content.map((c) => (
            <SingleMovie
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title}
              date={c.release_date}
              vote_average={c.vote_average}
            />
          ))}
      </div>
    </div>
  );
};