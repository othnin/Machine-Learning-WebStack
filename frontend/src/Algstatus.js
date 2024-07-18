import React, { useState, useEffect } from "react";
import { Button } from 'reactstrap';
import { CustomModal } from "./components/Modal_algstatus";
import axios from "axios";

/**
 * Renders the ML Algorithm Status List component.
 * @returns {JSX.Element} The ML Algorithm Status List component.
 */
//export function Algorithmstatus() {
const Algorithmstatus = () => {
  const [algList, setAlgList] = useState([]);
  const [modal, setModal] = useState(false);

  /**
   * Fetches the list of ML algorithm statuses from the API.
   */
  useEffect(() => {
    refreshList();
  }, []);

  /**
   * Refreshes the list of ML algorithm statuses by making a GET request to the API.
   */
  const refreshList = () => {
    axios
      .get("/api/v1/mlalgorithmstatuses")
      .then((res) => setAlgList(res.data))
      .catch((err) => console.log(err));
  };

  /**
   * Toggles the modal state.
   */
  const toggleModal = () => {
    setModal(!modal);
  };

  /**
   * Handles the form submission.
   * @param {Object} alg - The algorithm object.
   */
  const handleSubmit = (alg) => {
    toggleModal();
    alert("save" + JSON.stringify(alg));
  };

  /**
   * Renders the list of ML algorithm statuses.
   * @returns {JSX.Element[]} The list of ML algorithm statuses.
   */
  const renderAlgs = () => {
    return algList.map((alg) => (
      <li key={alg.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span> {alg.alg_name} </span>
        <span> {alg.status} </span>
        <span> {String(alg.active)} </span>
        <span> {alg.created_at} </span>
        <span> {alg.created_by} </span>
      </li>
    ));
  };

  /**
   * Renders the change status button and modal.
   * @returns {JSX.Element} The change status button and modal.
   */
  const changeStatusButton = () => {
    const uniqueAlgNames = Array.from(new Set(algList.map(alg => alg.alg_name)));

    // Create an array of objects with unique alg_names and their corresponding parent_mlalgorithm
    const uniqueAlgData = uniqueAlgNames.map(name => {
      const parentMlAlgorithm = algList.find(alg => alg.alg_name === name).parent_mlalgorithm;
      return { alg_name: name, parent_mlalgorithm: parentMlAlgorithm };
    });

    return (
      <div>
        <Button className="btn btn-secondary mr-2" onClick={() => toggleModal()}>
          Change Algorithm Status
        </Button>
        {modal && uniqueAlgData.length > 0 && (
          <CustomModal toggle={toggleModal} handleSubmit={handleSubmit} algList={uniqueAlgData} />
        )}
      </div>
    );
  };

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">ML Algorithm Status List</h1>
      <div className="row">
        <div className="col-md-10 col-sm-8 mx-auto p-0">
          <div className="card p-3">
            <ul className="list-group list-group-flush border-top-0">
              <li className="list-group-item d-flex justify-content-between align-items-center"> 
                <span>Name</span>
                <span>Status</span>
                <span>Active</span>
                <span>Created At</span>
                <span>Created By</span>
              </li>
              {renderAlgs()}
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-10 col-sm-8 mx-auto p-0">
          <div className="card p-3">
            {changeStatusButton()}             
          </div>
        </div>
      </div>
    </main>
  );
}

export default Algorithmstatus;
