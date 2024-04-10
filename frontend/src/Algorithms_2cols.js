import React, { Component } from "react";
import Modal from "./components/Modal";

const algItems = [
  {
    id: 1,
    title: "RDF for alpha",
    description: "Using alpha dataset. Using alpha dataset",
    version: "1.1a",
  },
  {
    id: 2,
    title: "RDF for beta",
    description: "Using beta dateset",
    version: "1.2345eas-1",
  },
  {
    id: 3,
    title: "XGB for alpha",
    description: "Using alpha dateset",
    version: "1.1a",
  },
  {
    id: 4,
    title: "RDF for alpha",
    description: "Using alpha dateset",
    version: "1.1a",
  },
];

export class Algorithms extends Component{
  constructor(props) {
    super(props);
    this.state = {
      algList: algItems,
      modal: false,
      activeItem : {
        title: "",
        description: "",
        version: "",
      },
    };
  }

  toggle = () => {
    this.setState({modal: !this.state.modal});
  };

  handleSubmit = (item) => {
    this.toggle();
    alert("save" +JSON.stringify(item));
  }

  handleDelete = (item) => {
    alert("delete" +JSON.stringify(item));
  }

  editItem = (item) => {
    this.setState({activteItem: item, modal: !this.state.modal});
  };



  renderAlgs = () => {
    const newAlgs = this.state.algList;

    return newAlgs.map((item) => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span> {item.title} </span>
        <span> {item.description} </span>
        <span> 
        <span>  {item.version} </span>
        </span>
      </li>
    ));
  };

  renderButtons = () => {
    const newAlgs = this.state.algList;

    return newAlgs.map((item) => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <button className="btn btn-secondary mr-2 btn-sm" onClick={() => this.editItem(item)}>
           Edit
        </button>
        <span> {' '} </span>
        <button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(item)}>
          Delete
        </button>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">ML Algorithm List</h1>
        <div className="row">
          <div className="col-md-10 col-sm-8 mx-auto p-0">
            <div className="card p-3">
              <ul className="list-group list-group-flush border-top-0">
                <li className="list-group-item d-flex justify-content-between align-items-center"> 
                  <span>Name</span>
                  <span>Description</span>
                  <span>Version</span>
                </li>
                  {this.renderAlgs()}
              </ul>
            </div>
          </div>
          <div className="col-md-2 col-sm-1 mx-auto p-0">
            <div className="card p-3">
              <ul className="list-group list-group-flush border-top-0">
              <li className="list-group-item d-flex justify-content-between align-items-center"></li>
              <li className="list-group-item d-flex justify-content-between align-items-center"></li>
                {this.renderButtons()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ): null}
      </main>
    );
  }
}
