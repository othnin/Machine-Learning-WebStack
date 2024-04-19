import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

export const CustomModal = ({ toggle, algList }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [status, setStatus] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Find the selected algorithm object
    const selectedAlgorithm = algList.find(alg => alg.alg_name === selectedOption);
  
    // Extract the ID of the parent_mlalgorithm
    const parentMlAlgorithmId = selectedAlgorithm.parent_mlalgorithm;

    const data = {
      status: status,
      created_by: createdBy,
      parent_mlalgorithm: parentMlAlgorithmId  // Pass the ID instead of alg_name
    };
  
    axios.post('/api/v1/mlalgorithmstatuses', data)
      .then(response => {
        console.log('POST request successful:', response.data);
        toggle(); // Close the modal
      })
      .catch(error => {
        console.error('Error making POST request:', error);
      });
  };
  
  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Change Algorithm Status</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="statusLabel">Status</Label>
          <Input type="text" name="status" id="statusID" placeholder="Enter status" onChange={(e) => setStatus(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="createdbyLabel">Created By</Label>
          <Input type="text" name="createdby" id="createdbyID" placeholder="Enter who created algorithm" onChange={(e) => setCreatedBy(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="MLLabel">Machine Learning Algorithm</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {selectedOption}
            </DropdownToggle>
            <DropdownMenu>
              {algList.map((algData, index) => (
                <DropdownItem key={index} onClick={() => handleOptionSelect(algData.alg_name)}>{algData.alg_name}</DropdownItem>
              ))}
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
