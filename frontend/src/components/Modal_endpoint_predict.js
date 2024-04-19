import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalEndpointPredict = ({ toggle, results }) => {
  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Prediction Results</ModalHeader>
      <ModalBody>
        {/* Display the results here */}
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEndpointPredict;
