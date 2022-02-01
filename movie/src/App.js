import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { ShowMovie } from "./ShowMovie";
import BottomNav from "./BottomNav";
import { TopRated } from "./TopRated";
import Navbar from "./Navbar"
import { Trending } from "./Trending";

function App() {
  return (
    <>
      <Router>
        <Navbar/>
          <div className="App">
            <Routes>
              <Route exact path="/" element={<TopRated />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/trending" element={<Trending/>}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/:id" element={<ShowMovie />}></Route>
            </Routes>
          </div>
      </Router>
    </>
  );
}

export default App;
