import logo from "./logo.svg";
import "./App.css";
import "./Navbar.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./Navbar.js";
import Home from "./Home";
import { Movies } from "./Movies";
import { Login } from "./Login";
import { Register } from "./Register";
import {ShowMovie} from './ShowMovie';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Movies />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/:id" element={<ShowMovie />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
