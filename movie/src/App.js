import logo from './logo.svg';
import './App.css';
import './Navbar.js';
import {BrowserRouter as Router,Switch,Route,Routes} from "react-router-dom";
import Header from './Navbar.js';
import Home from './Home';
import {Movies} from './Movies'

function App() {
  return (
    <Router>
      <div className="App">
      <Header/>
        <Routes>
          <Route path="/" element={<Movies/>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
