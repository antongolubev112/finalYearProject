import logo from './logo.svg';
import './App.css';
import './Navbar.js';
import {BrowserRouter as Router,Switch,Route,Routes} from "react-router-dom";
import Header from './Navbar.js';
import Home from './Home';

function App() {
  return (
    <Router>
      <div className="App">
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
