import './App.css';
import {Home} from './Home';
import {Algorithms} from './Algorithms';
import {Endpoints} from './Endpoints';
import {Algorithmstatus} from './Algstatus';
import {Test} from './test';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        React JS Frontend
      </h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/home">
              Home
            </NavLink>

            <NavLink className="btn btn-light btn-outline-primary" to="/test">
              test
            </NavLink>

            <NavLink className="btn btn-light btn-outline-primary" to="/Algorithms">
              MLAlgorithms
            </NavLink>

            <NavLink className="btn btn-light btn-outline-primary" to="/Endpoints">
              Endpoints
            </NavLink>

            <NavLink className="btn btn-light btn-outline-primary" to="/Algstatus">
              MLAlgorithm Status
            </NavLink>

          </li>
          </ul>
      </nav>

      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/algorithms' element={<Algorithms/>}/>
        <Route path='/endpoints' element={<Endpoints/>}/>
        <Route path='/algstatus' element={<Algorithmstatus/>}/>
      </Routes>  

    </div>
    </BrowserRouter>
  );
}

export default App;
