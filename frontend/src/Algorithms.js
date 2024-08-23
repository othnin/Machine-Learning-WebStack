import React, { useState, useEffect } from "react";
import { Button } from 'reactstrap';
import ModalAlgFeatures from "./components/Modal_algorithm_features";
import ModalAddGitHub from "./components/Modal_AddGitHubRepo";
import axios from "axios";
import './Algorithms.css';


/**
 * Algorithms component that displays a list of ML algorithms.
 */
const Algorithms = () => {
  const [algList, setAlgList] = useState([]);
  const [modalAlgFeatures, setModalAlgFeatures] = useState(false);
  const [modalAddGit, setModalAddGit] = useState(false);
  const [activeAlg, setActiveAlg] = useState({
    name: "",
    description: "",
    version: "",
    owner: "",
    createdat: "",
    code: "",
    url: ""
  });

  /**
   * Fetches the ML algorithms from the API and updates the state.
   */
  const refreshList = () => {
    axios
      .get("/api/v1/mlalgorithms")
      .then((res) => setAlgList(res.data))
      .catch((err) => console.log(err));
  };

  /**
   * Lifecycle method that is called after the component is mounted.
   * It fetches the ML algorithms from the API and updates the state.
   */
  useEffect(() => {
    refreshList();
  }, []);

  /**
   * Toggles the modalAlgFeatures state between open and closed.
   */
  const toggleAlgFeatures = () => {
    setModalAlgFeatures(!modalAlgFeatures);
  };

  /**
   * Sets the active algorithm and opens the modalAlgFeatures.
   * @param {Object} alg - The algorithm object to view.
   */
  const viewAlg = (alg) => {
    setActiveAlg(alg);
    setModalAlgFeatures(!modalAlgFeatures);
  };

  const toggleAddGit = () => {
    setModalAddGit(!modalAddGit);
  };

  const addRepo = () => {
    toggleAddGit();
  };

  const handleCloseModals = () => {
    setModalAddGit(false);
  };

  const handleCloseAllModals = () => {
    setModalAddGit(false);
    setModalAlgFeatures(false);
    refreshList();
  };


  /**
   * Renders the list of ML algorithms.
   * @returns {JSX.Element[]} - An array of JSX elements representing the ML algorithms.
   */
  const renderAlgs = () => {
    return algList.map((alg) => {
      const truncatedVersion = alg.version.length > 10 ? alg.version.substring(0, 10) + '...' : alg.version;
      return (
        <li key={alg.id} className="list-group-item d-flex justify-content-between align-items-center">
          <span className="alg-name">{alg.name}</span>
          <span className="alg-description">{alg.description}</span>
          <span className="alg-version">
            <span>{truncatedVersion}</span>
            <Button className="btn btn-secondary mr-2" onClick={() => viewAlg(alg)}>
              View
            </Button>
          </span>
        </li>
      );
    });
  };
  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">
        ML Algorithm List
      </h1>
      <div className="row">
        <div className="col-md-12 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <ul className="list-group list-group-flush border-top-0">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span className="alg-name">Name</span>
                <span className="alg-description">Description</span>
                <span className="alg-version">Version</span>
              </li>
              {renderAlgs()}
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-10 col-sm-8 mx-auto p-0">
          <div className="card p-3">
            <button className="btn btn-secondary mr-2" onClick={addRepo}>
              Add GitHub Repo
            </button>
          </div>
        </div>
      </div>
      {modalAlgFeatures ? (
        <ModalAlgFeatures activeAlg={activeAlg} toggle={toggleAlgFeatures} />
      ) : null}
      {modalAddGit ? (
        <ModalAddGitHub toggle={toggleAddGit} handleCloseModals={handleCloseModals} handleCloseAllModals={handleCloseAllModals} />
      ) : null}
    </main>
  );
};

export default Algorithms;