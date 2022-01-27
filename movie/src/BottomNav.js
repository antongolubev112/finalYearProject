import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MovieIcon from "@mui/icons-material/Movie";

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    backgroundColor: "#1D2731 !important" ,
    zIndex: 100,
    paddingTop: '2px',
  },
});

export default function BottomNav() {
  const classes = useStyles();
  let navigate = useNavigate(); 
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (value === 0) {
        navigate("/");
    } else if (value === 1) {
        navigate("/trending");
    } else if (value === 2) {
        navigate("/recommendations");
    } else if (value === 3) {
        navigate("/favorites")
    } else if (value === 4) {
        navigate("/login")
    }
  }, [value, navigate]);

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        className={classes.root}
      >
        <BottomNavigationAction style={{ color: "white" }} label="Top Rated" icon={<HomeIcon/>} />
        <BottomNavigationAction style={{ color: "white" }} label="Trending" icon={<WhatshotIcon/>} />
        <BottomNavigationAction style={{ color: "white" }} label="Recommendations" icon={<MovieIcon />} />
        <BottomNavigationAction style={{ color: "white" }} label="Favorites" icon={<FavoriteIcon/>} />
        <BottomNavigationAction style={{ color: "white" }} label="Account" icon={<AccountCircleIcon/>} />
        
      </BottomNavigation>
    </Box>
  );
}
