import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAlg: this.props.activeAlg,
    };
  }


  render() {
    const { toggle } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle} >
        <ModalHeader toggle={toggle}>ML Algorithm</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="ml-title">Name</Label>
              <Input
                readOnly={true}
                type="text"
                id="ml-title"
                name="title"
                value={this.state.activeAlg.name}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-description">Description</Label>
              <Input
                readOnly={true}
                type="text"
                id="ml-description"
                name="description"
                value={this.state.activeAlg.description}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-version">Version</Label>
              <Input
                readOnly={true}
                type="text"
                id="ml-verion"
                name="version"
                value={this.state.activeAlg.version}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-owner">Owner</Label>
              <Input
                readOnly={true}
                type="text"
                id="ml-owner"
                name="owner"
                value={this.state.activeAlg.owner}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-createdat">Creation Date</Label>
              <Input
                readOnly={true}
                type="text"
                id="ml-createdat"
                name="createdat"
                value={this.state.activeAlg.created_at}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-code">Code</Label>
              <Input
                readOnly={true}
                type="textarea"
                id="ml-code"
                name="code"
                value={this.state.activeAlg.code}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="save" onClick={() => toggle()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}