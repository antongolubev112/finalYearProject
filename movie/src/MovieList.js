import axios from "axios";
import { useEffect, useState } from "react";
import { SingleMovie } from "./SingleMovie";

export const MovieList = () => {
    const [content,setContent]= useState([]);

    //get movies from api
    const fetchMovies= async ()=>{
        const{data}= await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API}`);
        console.log(data);
        setContent(data.results);
    }

    useEffect(()=>{
       fetchMovies();  
    },[])

    return (
        <div>
            <span className="MovieList__Title"> Home </span>
            <div className='MovieList'>
                {/* if content is not empty and  */}
                {
                    content && content.map((c)=>(
                        <SingleMovie key={c.id} 
                        id={c.id} 
                        poster={c.poster_path} 
                        title={c.title} 
                        date={c.release_date}
                        vote_average={c.vote_average}/>
                    ))
                }
            </div>
        </div>
    )
}