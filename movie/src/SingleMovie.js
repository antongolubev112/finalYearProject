import { img_300 } from "./config/config";
import "./singleMovie.css";
import MovieModal from "./MovieModal";

//destructure and recieve props
export const SingleMovie = ({ id, poster, title, date, vote_average }) => {
  return (
    //passing single movie into movieModal as children
    <MovieModal id={id}>
      {/* fetch movie poster using api img size and the poster url */}
      <img className="SingleMovie__poster" src={`${img_300}/${poster}`} />
      <b className="SingleMovie__title">{title}</b>
      <span className="SingleMovie__details">
        {vote_average}
        <span className="SingleMovie__details">{date}</span>
      </span>
    </MovieModal>
  );
};
