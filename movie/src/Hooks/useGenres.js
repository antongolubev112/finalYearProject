const useGenres=(selectedGenres)=>{
    if(selectedGenres.length<1){
        return "";
    }
    
    //extract genre id from selected genre array
    const GenreIds= selectedGenres.map((genre)=> genre.id)

    //Add all the genre ids into a string seperated by commas.
    //accumulator is the value being returned.
    return GenreIds.reduce((accumulator,current)=>accumulator+","+current);
}

export default useGenres;