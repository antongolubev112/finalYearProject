import axios from "axios";
import { useEffect, useState } from "react";
import { SingleMovie } from "./SingleMovie";
import "./movielist.css";

export const Trending = () => {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState([1]);

  const updateMovies = async () => {
      //fetch movies from api
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API}&page=${page}`
    );
    console.log(data);
    //append fetched movies to previously fetched movies

    setContent(previousContent=>([...previousContent, ...data.results]))
  };

  //use effect runs after first render and after every update
  useEffect(()=>{
    const onScroll = function () {
        //if user reaches bottom of page then fetch more movies 
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            let newPage=page;
            console.log("page: "+page);
            newPage++;
            console.log("newPage: "+newPage);
            setPage(newPage);
            console.log("page: "+page);            
        }
     };
     updateMovies();
     window.addEventListener('scroll', onScroll)
     return () => window.removeEventListener('scroll', onScroll)
     //fire every time page is updated
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