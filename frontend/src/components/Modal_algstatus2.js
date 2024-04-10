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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAlg: this.props.activeAlg,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    const activeAlg = { ...this.state.activeAlg, [name]: value };
    this.setState({ activeAlg });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>ML Algorithm Status</ModalHeader>
        <ModalBody>
          <Form>
            <Dropdown>
              <DropdownToggle caret>Name</DropdownToggle>
              <DropdownMenu>
                <DropdownItem >
                  Prod A
                </DropdownItem>
                <DropdownItem onClick={() => this.handleChangeDropdown("Prod B")} dropDownValue="Prod B">
                  Prod B
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>           
            <FormGroup>
              <Label for="ml-status">Status</Label>
              <Input
                type="text"
                id="ml-status"
                name="status"
                value={this.state.activeAlg.status}
                onChange={this.handleChange}
                placeholder="Enter status of the ML Algorithm"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-active">Active</Label>
              <Input
                type="text"
                id="ml-active"
                name="active"
                value={this.state.activeAlg.active}
                onChange={this.handleChange}
                placeholder="Enter ML algorithm active"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-created_at">Created At</Label>
              <Input
                type="text"
                id="ml-created_at"
                name="created_at"
                value={this.state.activeAlg.created_at}
                onChange={this.handleChange}
                placeholder="Enter ML algorithm created at date"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ml-created_by">Created By</Label>
              <Input
                type="text"
                id="ml-created_by"
                name="created_by"
                value={this.state.activeAlg.created_by}
                onChange={this.handleChange}
                placeholder="Enter ML algorithm created by date"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeAlg)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}