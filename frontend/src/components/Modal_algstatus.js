import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      modal: false,
      selectedOption: 'Option 1',
      activeAlg: this.props.activeAlg,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleOptionSelect(option) {
    this.setState({
      selectedOption: option
    });
  }

  render() {
    
    return (
      <div>
        <Button color="primary" onClick={this.toggleModal}>Open Modal</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Example Modal</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="exampleName">Name</Label>
              <Input type="text" name="name" id="exampleName" placeholder="Enter your name" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" />
            </FormGroup>
            <FormGroup>
              <Label for="examplePhone">Phone</Label>
              <Input type="tel" name="phone" id="examplePhone" placeholder="Enter your phone number" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleAddress">Address</Label>
              <Input type="text" name="address" id="exampleAddress" placeholder="Enter your address" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleDropdown">Dropdown</Label>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                  {this.state.selectedOption}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => this.handleOptionSelect('Option 1')}>Option 1</DropdownItem>
                  <DropdownItem onClick={() => this.handleOptionSelect('Option 2')}>Option 2</DropdownItem>
                  <DropdownItem onClick={() => this.handleOptionSelect('Option 3')}>Option 3</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


