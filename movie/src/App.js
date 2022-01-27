import logo from "./logo.svg";
import "./App.css";
import "./Navbar.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import { Movies } from "./Movies";
import { Login } from "./Login";
import { Register } from "./Register";
import { ShowMovie } from "./ShowMovie";
import BottomNav from "./BottomNav";
import { Container } from "@material-ui/core";
import { MovieList } from "./MovieList";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<MovieList />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/:id" element={<ShowMovie />}></Route>
          </Routes>
        </div>
        <BottomNav />
      </Router>
    </>
  );
}

export default App;
