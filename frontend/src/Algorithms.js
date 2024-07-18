import React, { Component } from "react";
import ModalAlgFeatures from "./components/Modal_algorithm_features";
import axios from "axios";

/**
 * Algorithms component that displays a list of ML algorithms.
 */
export class Algorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      algList: [],
      modal: false,
      activeAlg: {
        name: "",
        description: "",
        version: "",
        owner: "",
        createdat: "",
        code: "",
        url: ""
      }
    };
  }

  /**
   * Lifecycle method that is called after the component is mounted.
   * It fetches the ML algorithms from the API and updates the state.
   */
  componentDidMount() {
    this.refreshList();
  }

  /**
   * Fetches the ML algorithms from the API and updates the state.
   */
  refreshList = () => {
    axios
      .get("/api/v1/mlalgorithms")
      .then((res) => this.setState({ algList: res.data }))
      .catch((err) => console.log(err));
  };

  /**
   * Toggles the modal state between open and closed.
   */
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  /**
   * Sets the active algorithm and opens the modal.
   * @param {Object} alg - The algorithm object to view.
   */
  viewAlg = (alg) => {
    this.setState({ activeAlg: alg, modal: !this.state.modal });
  };

  /**
   * Renders the list of ML algorithms.
   * @returns {JSX.Element[]} - An array of JSX elements representing the ML algorithms.
   */
  renderAlgs = () => {
    const newAlgs = this.state.algList;

    return newAlgs.map((alg) => (
      <li
        key={alg.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span> {alg.name} </span>
        <span> {alg.description} </span>
        <span>
          <span> {alg.version} {' '} </span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.viewAlg(alg)}
          >
            View
          </button>
        </span>
      </li>
    ));
  };

  render() {
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
                  <span>Name</span>
                  <span>Description</span>
                  <div style={{ position: "relative", left: "-140px" }}>
                    Version
                  </div>
                </li>
                {this.renderAlgs()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <ModalAlgFeatures activeAlg={this.state.activeAlg} toggle={this.toggle} />
        ) : null}
      </main>
    );
  }
}
