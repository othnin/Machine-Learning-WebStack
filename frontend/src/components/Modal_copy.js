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
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>ML Algorithm</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="ml-title">Title</Label>
              <Input
                type="text"
                id="ml-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Title of the ML Algorithm"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-description">Description</Label>
              <Input
                type="text"
                id="ml-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter ML algorithm description"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-version">Version</Label>
              <Input
                type="text"
                id="ml-verion"
                name="version"
                value={this.state.activeItem.version}
                onChange={this.handleChange}
                placeholder="Enter ML algorithm version"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}