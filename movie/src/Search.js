import {
  Button,
  createTheme,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { SingleMovie } from "./SingleMovie";

const Search = () => {
  const [type, setType] = useState(0);  
  const [searchInput,setSearchInput]=useState("");
  const [content, setContent]=useState();

  const theme = createTheme({
    pallete: {
      type: "dark",
      primary: {
        main: "#d9b310",
      },
    },
  });

  const fetchSearch = async () =>{
    const {data} = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API}&query=${searchInput}`);
    
    setContent(data.results);
  }

  useEffect(()=>{
      //bring to top of page
    fetchSearch();
  },[searchInput])


  return (
    <div>
      <ThemeProvider theme={theme}>
        <div style={{display: "flex" ,justifyContent: 'center', margin: "15px, 0"}}>
          <TextField
            style = {{width: 500}} 
            className="searchBox"
            label="Search"
            color="primary"
            variant="filled"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </ThemeProvider>
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
      {searchInput && !content && <h2>No Movies Found</h2>}
    </div>
  );
};

export default Search;
