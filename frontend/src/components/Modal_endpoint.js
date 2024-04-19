import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import axios from 'axios';
import ModalEndpointPredict from './Modal_endpoint_predict'; // Import the new modal component

export const CustomModal = ({ toggle, endpoint }) => {
  const [predictionValues, setPredictionValues] = useState('');
  const [results, setResults] = useState(null); // State to hold the results
  const [showResultsModal, setShowResultsModal] = useState(false); // State to control the results modal

  // Function to handle form submission
  const handleSubmit = async () => {
    // Parse the JSON string in predictionValues textarea
    const parsedPredictionValues = JSON.parse(predictionValues);
    
    try {
      const response = await axios.post('/api/v1/income_classifier/predict', parsedPredictionValues);
      setResults(response.data); // Set the results received from the API
      setShowResultsModal(true); // Open the results modal
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  const handleResultsModalClose = () => {
    setShowResultsModal(false); // Close the results modal
    toggle(); // Close the current modal
  };

  return (
    <>
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Predict Values</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="predictLabel">Predictions</Label>
            <Input
              type="textarea"
              name="predictionValues"
              id="predictionID"
              placeholder="Enter values for predict"
              value={predictionValues}
              onChange={(e) => setPredictionValues(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Results Modal */}
      {showResultsModal && (
        <ModalEndpointPredict 
          toggle={handleResultsModalClose} 
          results={results} 
        />
      )}
    </>
  );
};
