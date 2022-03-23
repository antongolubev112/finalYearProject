import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { img_500 } from "./config/config";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import YouTubeIcon from "@material-ui/icons/YouTube";
import "./movieModal.css";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "./state/userSlice";
import { useDispatch } from "react-redux";
import { like, unlike, addDislike, removeDislike } from "./state/userSlice";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ThumbDownOffAltRoundedIcon from "@mui/icons-material/ThumbDownOffAltRounded";

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
  const [movie, setmovie] = useState();
  const [trailer, setTrailer] = useState();
  const [token, setToken] = useState();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [originalMovie, setOriginalMovie] = useState();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API}`
    );

    setTrailer(data.results[0]?.key);
  };

  const likeMovie = async (e) => {
    if (liked == false) {
      setLiked(true);
      //update the likes state object in redux
      dispatch(
        like({
          id: id,
        })
      );
    } else {
      setLiked(false);
      //update the likes state object in redux
      dispatch(unlike(id));
    }
    //get details about the liked movie from TMDB api
    const [cast, keywords] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${process.env.REACT_APP_API}`
      ),
    ]);
    //console.log(cast);
    //console.log(keywords);

    //console.log("token ", token);
    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      // add token to http header
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      //put movie details into json format
      body: JSON.stringify({
        movie_id: movie.id,
        title: movie.title,
        genres: movie.genres,
        overview: movie.overview,
        keywords: keywords.data.keywords,
        cast: cast.data.cast,
        crew: cast.data.crew,
      }),
    };
    try {
      //send request to backend
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
  };

  const dislikeMovie = async (e) => {
    if (disliked == false) {
      if ((liked == true)) {
        setLiked(false);
        //update the likes state object in redux
        dispatch(unlike(id));
      }
      setDisliked(true);
      //update the likes state object in redux
      dispatch(
        addDislike({
          id: id,
        })
      );
    } else {
      setDisliked(false);
      //update the dislikes state object in redux
      dispatch(removeDislike(id));
    }

    const options = {
      method: "POST",
      // tell backend that this data will be json because that's what its expecting
      // add token to http header
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      //put movie details into json format
      body: JSON.stringify({
        movie_id: movie.id,
        title: movie.title,
      }),
    };
    try {
      //send request to backend
      const response = await fetch("/dislike", options);
      const json = await response.json();
      if (response.status === 200) {
        return json;
      }
      console.log(json);
    } catch (error) {
      //log error
      console.error("There was an error: ", error);
    }
  };

  //check if the movie is in the liked movies state
  const checkLikes = () => {
    if (user.likes.find((x) => x.id == id)) {
      setLiked(true);
    }
  };

  const checkDislikes = () => {
    if (Object.values(user.dislikes).find((x) => x.id == id)) {
      setDisliked(true);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVideo();

    setToken(sessionStorage.getItem("token"));
    return () => {
      setmovie({});
    };
  }, []);

  useEffect(() => {
    console.log('user state changed!')
    if (user != null) {
      checkLikes();
      checkDislikes();
    }
  }, [liked,disliked]);

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
                    {(movie.release_date || "-----").substring(0, 4)})
                    <IconButton
                      onClick={(e) => {
                        likeMovie(e);
                      }}
                      color="secondary"
                      aria-label="add an alarm"
                    >
                      {liked ? (
                        <ThumbUpAltRoundedIcon />
                      ) : (
                        <ThumbUpAltOutlinedIcon />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={(e) => {dislikeMovie(e)}}
                      color="secondary"
                      aria-label="add an alarm"
                    >
                      {disliked ? (
                        <ThumbDownRoundedIcon />
                      ) : (
                        <ThumbDownOffAltRoundedIcon />
                      )}
                    </IconButton>
                  </span>

                  {movie.tagline && <i className="tagline">{movie.tagline}</i>}

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
