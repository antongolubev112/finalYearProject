import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const ShowMovie = () => {
    const {id} = useParams();
    const [movie, setMovie]= useState([]);

    useEffect(() => {
        //fetch from /movie with a given id
        fetch(`/movie/${id}`)
        .then(response => response.json())
        .then(data => setMovie(data))
    //if id changes, make new request
    },[id])

    return(
        <div>
            {movie.length>0 && movie.map(data => 
            <div className='movie'>
                <div className='movie__title'>
                    {data.title}
                </div>
                <img src={data.posterUrl} />
                {data.rtScore}
                {data.imdbScore}
                {data.rating}
                {data.runtime}
                {data.studio}
                {data.boxOffice}
                {data.releaseDate}
            </div>)}
        </div>
    )
}