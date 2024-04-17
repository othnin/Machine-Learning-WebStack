import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export const CustomModal = ({ toggle, handleSubmit }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Option 1');

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Example Modal</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="statusLabel">status</Label>
          <Input type="text" name="status" id="statusID" placeholder="Enter status" />
        </FormGroup>
        <FormGroup>
          <Label for="createdbyLabel">Created By</Label>
          <Input type="text" name="createdby" id="createdbyID" placeholder="Enter who created algorithm" />
        </FormGroup>
        <FormGroup>
          <Label for="MLLabel">Machine Learning Algorithm</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {selectedOption}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handleOptionSelect('Option 1')}>Option 1</DropdownItem>
              <DropdownItem onClick={() => handleOptionSelect('Option 2')}>Option 2</DropdownItem>
              <DropdownItem onClick={() => handleOptionSelect('Option 3')}>Option 3</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};


