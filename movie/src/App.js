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
import Search from "./Search"


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
              <Route path="/:id" element={<ShowMovie />}></Route>
              <Route path="/search" element={<Search/>}></Route>
            </Routes>
          </div>
      </Router>
    </>
  );
}

export default App;
