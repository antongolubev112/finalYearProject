import { Chip } from "@material-ui/core";
import axios from "axios";
import { useEffect } from "react";

const Genres = ({ selectedGenres, setSelectedGenres, genres, setGenres }) => {
  //pass in a genre and add it to the selectedGenres array
  const selectGenre = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    //set genres to a new array without the selected genre
    setGenres(genres.filter((g) => g.id !== genre.id));
  };

  const unselectGenre = (genre) => {
    setSelectedGenres(
        selectedGenres.filter((selected)=>selected.id !== genre.id)
    );
    //set genres to a new array without the selected genre
    setGenres([...genres,genre]);
  };
  //get genre list from api
  const fetchGenres = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=15a5b586e8467d37fb18ad12df7c3810`
    );
    setGenres(data.genres);
  };

  useEffect(() => {
    fetchGenres();

    //unmount. cancels api call
    return () => {
      setGenres = {};
    };
  }, []);

  return (
    <div style={{ padding: "6px 0" }}>
      {selectedGenres &&
        selectedGenres.map((genre) => (
          <Chip
            YES
            label={genre.name}
            style={{ margin: 3 }}
            size="large"
            color="primary"
            key={genre.id}
            clickable
            onDelete={()=>unselectGenre(genre)}
          >
            {" "}
          </Chip>
        ))}
      {genres &&
        genres.map((genre) => (
          <Chip
            label={genre.name}
            style={{ margin: 3 }}
            size="large"
            key={genre.id}
            clickable
            onClick={() => selectGenre(genre)}
          >
            {" "}
          </Chip>
        ))}
    </div>
  );
};

export default Genres;
