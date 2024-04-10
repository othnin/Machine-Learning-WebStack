import React, { Component } from "react";
import axios from "axios";


export class Endpoints extends Component{
  constructor(props) {
    super(props);
    this.state = {
      endpointList: [],
      activeEndpoint : {
        name: "",
        owner: "",
        createdat: "",
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/v1/endpoints")
      .then((res) => this.setState({ endpointList: res.data }))
      .catch((err) => console.log(err));
  };

  renderEndpoints = () => {
    const newEndpoints = this.state.endpointList;

    return newEndpoints.map((endpoint) => (
      <li key={endpoint.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span> {endpoint.name} </span>
        <span> {endpoint.owner} </span>
        <span> 
        <span>  {endpoint.created_at} {' '} </span>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Endpoints List</h1>
        <div className="row">
          <div className="col-md-12 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <ul className="list-group list-group-flush border-top-0">
                <li className="list-group-item d-flex justify-content-between align-items-center"> 
                  <span>Name</span>
                  <span>Owner</span>
                  <span>Created at</span>
                </li>
                  {this.renderEndpoints()}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
