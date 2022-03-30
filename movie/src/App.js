import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { ShowMovie } from "./ShowMovie";
import { TopRated } from "./TopRated";
import Navbar from "./Navbar"
import { Discover } from "./Discover";
import Search from "./Search";
import {LikedMovies} from './LikedMovies'
import {Recommendations} from './Recommendations'
import {About} from './About.js'


function App() {
  

  return (
    <>
      <Router>
        <Navbar/>
          <div className="App">
            <Routes>
              <Route exact path="/" element={<Discover/>}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/top" element={<TopRated/>}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/search" element={<Search/>}></Route>
              <Route path="/likes" element={<LikedMovies/>}></Route>
              <Route path='/recommend' element={<Recommendations/>}></Route>
              <Route path='/about' element={<About/>} ></Route>
            </Routes>
          </div>
      </Router>
    </>
  );
}

export default App;
