import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { img_500 } from "./config/config";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import YouTubeIcon from "@material-ui/icons/YouTube";
import "./movieModal.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "90%",
    height: "80%",
    backgroundColor: "#0B3C5D",
    border: "1px solid #282c34",
    borderRadius: 10,
    color: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
  },
}));

export default function BasicModal({ children, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [cast, setCast] = useState();
  const [movie, setmovie] = useState();
  const [trailer, setTrailer] = useState();
  const [token,setToken]=useState();
  const [keyword,setKeywords]= useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API}`
    );

    setmovie(data);
    //console.log(data);
  };

  const fetchCast= async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API}`
    );

    setCast(data);
  }

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API}`
    );

    setTrailer(data.results[0]?.key);
  };


  const likeMovie = async (e)=>{
    const[cast,keywords]= await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API}`),
      axios.get(`https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${process.env.REACT_APP_API}`)
    ])

    setCast(cast);
    setKeywords(keywords);
    console.log(cast);
    console.log(keywords)



    console.log("token ",token)
    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      headers: {
        "Content-Type": "application/json",
        "Authorization":"Bearer "+token
      },
      //convert email and password to a json string
      body: JSON.stringify({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        keywords: keywords.data.keywords,
        cast:cast.data.cast,
        crew:cast.data.crew
      }),
    };
    try {
      const response = await fetch("/like", options);
      const json = await response.json();
      if (response.status === 200) {
        return json;
      }
      console.log(json);
    } catch (error) {
      //log error
      console.error("There was an error: ", error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchVideo();
    //fetchCast();
    
    setToken(sessionStorage.getItem("token"));
    return () => {
      setmovie({});
    };
  }, []);

  return (
    <div>
      <div
        className="SingleMovie"
        style={{ cursor: "pointer" }}
        color="inherit"
        onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {movie && (
            <div className={classes.paper}>
              <div className="MovieModal">
                <img
                  src={`${img_500}/${movie.poster_path}`}
                  alt={movie.title}
                  className="MovieModal__portrait"
                />
                <img
                  src={`${img_500}/${movie.backdrop_path}`}
                  alt={movie.title}
                  className="MovieModal__landscape"
                />
                <div className="MovieModal__about">
                  <span className="MovieModal__title">
                    {movie.title} (
                    {(
                      movie.release_date ||
                      "-----"
                    ).substring(0, 4)}
                    )
                    <IconButton onClick={(e)=>{likeMovie(e)}} color="secondary" aria-label="add an alarm">
                      <FavoriteBorderIcon />
                    </IconButton>
                  </span>
                  {movie.tagline && (
                    <i className="tagline">{movie.tagline}</i>
                  )}

                  <span className="MovieModal__description">
                    {movie.overview}
                  </span>

                  <Button
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    color="secondary"
                    target="__blank"
                    href={`https://www.youtube.com/watch?v=${trailer}`}
                  >
                    Watch the Trailer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </div>
  );
}
