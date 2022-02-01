import axios from "axios";
import { useEffect, useState } from "react";
import { SingleMovie } from "./SingleMovie";
import "./movielist.css";

export const TopRated = () => {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState([1]);

  //get movies from api
  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API}&page=1`
    );
    console.log(data);
    setContent(data.results);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const updateMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API}&page=${page}`
    );
    console.log(data);
    setContent(previousContent=>([...previousContent, ...data.results]))
  };

  useEffect(()=>{
    const onScroll = function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            let newPage=page;
            console.log("page: "+page);
            newPage++;
            console.log("newPage: "+newPage);
            setPage(newPage);
            console.log("page: "+page);
            updateMovies();
        }
     };
     window.addEventListener('scroll', onScroll)
     return () => window.removeEventListener('scroll', onScroll)
  },[page]);

  return (
    <div>
      <span className="MovieList__Title"> </span>
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
