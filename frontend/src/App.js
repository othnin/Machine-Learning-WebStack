import './App.css';
import {Home} from './Home';
import {Algorithms} from './Algorithms';
//import {Endpoints} from './Endpoints';  //For some reason this stopped working?
import Endpoints from "./Endpoints";
import {Algorithmstatus} from './Algstatus';
//import Algorithmstatus from './Algstatus';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        React JS Frontend
      </h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav w-100 justify-content-between">
        <li className="nav-item">
          <NavLink className="btn btn-light btn-outline-primary" to="/home">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="btn btn-light btn-outline-primary" to="/Algorithms">
            MLAlgorithms
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="btn btn-light btn-outline-primary" to="/Endpoints">
            Endpoints
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="btn btn-light btn-outline-primary" to="/Algstatus">
            MLAlgorithm Status
          </NavLink>
        </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/algorithms' element={<Algorithms/>}/>
        <Route path='/endpoints' element={<Endpoints/>}/>
        <Route path='/algstatus' element={<Algorithmstatus/>}/>
      </Routes>  

    </div>
    </BrowserRouter>
  );
}

export default App;
