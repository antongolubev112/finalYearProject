import React, {useState, useEffect } from 'react'
import { GetMovies } from './getMovies'
//import "./movie.css"

export const Movies=()=> {
    const[movie,setMovie]= useState([])
    
    useEffect(()=>{
        //fetch from api
        fetch('/movies').then(response=>{
            if(response.ok){
                return response.json()
            }
        }).then(data=>setMovie(data))
    },[])

    // fetch("/movies").then(async response => {
    //     try {
    //      const data = await response.json()
    //      console.log('response data?', data)
    //    } catch(error) {
    //      console.log('Error happened here!')
    //      console.error(error)
    //    }
    //   })

    return (
        <>
            <GetMovies listOfMovies={movie}/>
        </>
    )
}

