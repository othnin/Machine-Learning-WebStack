import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomModal } from "./components/Modal_endpoint";
import './App.css';
/**
 * Represents the Endpoints component. Functional Component.
 * This component displays a list of endpoints and allows the user to open a modal for each endpoint.
 *
 * @returns {JSX.Element} The Endpoints component.
 */
const Endpoints = () => {
  const [endpointList, setEndpointList] = useState([]);
  const [activeEndpoint, setActiveEndpoint] = useState({
    name: "",
    owner: "",
    createdat: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("/api/v1/endpoints")
      .then((res) => setEndpointList(res.data))
      .catch((err) => console.log(err));
  };

  const openModal = (endpoint) => {
    setActiveEndpoint(endpoint);
    setIsModalOpen(true);
  };

  const renderEndpoints = () => {
    return endpointList.map((endpoint) => (
      <li
        key={endpoint.id}
        className="list-item"
        onClick={() => openModal(endpoint)} // Call openModal on click
        style={{ cursor: "pointer" }} // Change cursor to pointer
      >
        <span className="item-cell" style={{ textDecoration: "underline" }}>{endpoint.name}</span>
        <span className="item-cell">  {endpoint.owner} </span>
        <span>
          <span className="item-cell" > {endpoint.created_at} </span>
        </span>
      </li>
    ));
  };
  
  return (
    <main className="container">
      {/* Endpoint Modal */}
      {isModalOpen && (
        <CustomModal
          toggle={() => setIsModalOpen(false)}
          endpoint={activeEndpoint}
        />
      )}
      <div className="modal-window">
      <h1 className="text-grey text-uppercase text-center my-4 modal-title">Endpoints List</h1>
      <div className="row">
        <div className="col-md-12 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <ul className="list-group list-group-flush border-top-0">
              <li className="list-item header">
                <span className="item-cell">Name</span>
                <span className="item-cell">Owner</span>
                <span className="item-cell">Created at</span>
              </li>
              {renderEndpoints()}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
};


export default Endpoints;
