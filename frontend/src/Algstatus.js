import React, { Component } from "react";
import Modal from "./components/Modal_algstatus";
import axios from "axios";


export class Algorithmstatus extends Component{
  constructor(props) {
    super(props);
    this.state = {
      algList: [],
      modal: false,
      activeAlg : {
        status: "",
        active: "",
        created_by: "",
        created_at: "",
        alg_name: "",

      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/v1/mlalgorithmstatuses")
      .then((res) => this.setState({ algList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({modal: !this.state.modal});
  };

  handleSubmit = (alg) => {
    this.toggle();
    alert("save" +JSON.stringify(alg));
  }

  handleDelete = (alg) => {
    alert("delete" +JSON.stringify(alg));
  }


  changeAlgStatus = () => {
    this.setState({activeAlg: this.state.algList, modal: !this.state.modal});
  };

  renderAlgs = () => {
    const newAlgs = this.state.algList;
    
    return newAlgs.map((alg) => (
      <li key={alg.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span> {alg.alg_name} </span>
        <span> {alg.status} </span>
        <span> {String(alg.active)} </span>
        <span> {alg.created_at} </span>
        <span> {alg.created_by} </span>
      </li>
    ));
  };

  renderButton = () => {
    return (
    <button className="btn btn-secondary mr-2" onClick={() => this.changeAlgStatus(this.state.activeAlg)}>
      Change Algorithm Status
    </button>
    )

  }



  render() {
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
                  {this.renderAlgs()}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-sm-8 mx-auto p-0">
            <div className="card p-3">
              {this.renderButton()}             
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeAlg={this.state.activeAlg}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ): null}
      </main>
    );
  }
}
