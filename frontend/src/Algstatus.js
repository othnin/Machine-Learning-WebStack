import React, { useState, useEffect } from "react";
import { Button } from 'reactstrap';
import { CustomModal } from "./components/Modal_algstatus";
import axios from "axios";

export function Algorithmstatus() {
  const [algList, setAlgList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeAlg, setActiveAlg] = useState({
    status: "",
    active: "",
    created_by: "",
    created_at: "",
    parent_mlalgorithm: "",
    alg_name: "",
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("/api/v1/mlalgorithmstatuses")
      .then((res) => setAlgList(res.data))
      .catch((err) => console.log(err));
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSubmit = (alg) => {
    toggleModal();
    alert("save" + JSON.stringify(alg));
  };

  const changeAlgStatus = () => {
    setActiveAlg(algList);
    toggleModal();
  };

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

  const renderButton = () => {
    return (
      <div>
        <Button className="btn btn-secondary mr-2" onClick={() => toggleModal()}>
          Change Algorithm Status
        </Button>
        {modal && <CustomModal toggle={toggleModal} handleSubmit={handleSubmit} />}
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
            {renderButton()}             
          </div>
        </div>
      </div>
    </main>
  );
}

