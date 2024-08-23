import React, { useState, useEffect } from 'react';
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
import axios from 'axios';


const ModalAddGitHubFeatures = ({ toggle, statusChoices, initialData, handleCloseAllModals }) => {
  const [formData, setFormData] = useState({
    description: '',
    endpointName: '',
    algName: '',
    algStatus: statusChoices.length > 0 ? statusChoices[0].value : '', // Set default value
    algVerion: '',
    author: initialData['commit']['author'],
    description: '',
    URL: initialData['url'],
    branch: initialData['commit']['branch'],
    commitNum: initialData['commit']['commit_number'],
    sourceFileName: '',
    trainFileName: '',
    encoderFileName: '',
    modelFileName: ''
  });

  //Ensure that initialData is merged w/the default values when it is available
  useEffect(() => {
    if (initialData) {
      setFormData(prevFormData => ({
        ...prevFormData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Apply no spaces rule only for endpointName
    if (name === 'endpointName' && /\s/.test(value)) {
      alert('No spaces allowed in the endpoint name.');
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    axios.post('/api/v1/save_github_repo/', formData)
    .then(response => {
      console.log(response.data);
      handleCloseAllModals();
    })
    .catch(error => {
      console.error('Error making POST request:', error);
    });
  };    


  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add GitHub Features</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="endpoint-name">Endpoint Name</Label>
            <Input
              type="text"
              id="endpoint-name"
              name="endpointName"
              value={formData.endpointName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="alg-name">Algorithm Name</Label>
            <Input
              type="text"
              id="alg-name"
              name="algName"
              value={formData.algName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
          <Label for="alg-status">Algorithm Status</Label>
            <Input
              type="select"
              id="alg-status"
              name="algStatus"
              value={formData.algStatus}
              onChange={handleInputChange}
            >
              {statusChoices.map(choice => (
                <option key={choice.value} value={choice.text}>
                  {choice.text}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              id="description-id"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="commit-num">Commit Number</Label>
            <Input
              type="text"
              id="commit-id"
              name="commitNmum"
              value={formData.commitNum}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="author-id">Author</Label>
            <Input
              type="text"
              id="author-id"
              name="author"
              value={formData.author}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="url-id">URL</Label>
            <Input
              type="text"
              id="url-id"
              name="url"
              value={formData.URL}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="branch-id">Branch</Label>
            <Input
              type="text"
              id="branch-id"
              name="branch"
              value={formData.branch}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="sourcefile-id">Source File Name</Label>
            <Input
              type="text"
              id="sourcefile-id"
              name="sourceFileName"
              value={formData.sourceFileName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="trainFile-id">Training File Name</Label>
            <Input
              type="text"
              id="trainFile-id"
              name="trainFileName"
              value={formData.trainFileName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="encoderFile-id">Encoder File Name</Label>
            <Input
              type="text"
              id="encoderFile-id"
              name="encoderFileName"
              value={formData.encoderFileName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="modelFile-id">Model File Name</Label>
            <Input
              type="text"
              id="modelFile-id"
              name="modelFileName"
              value={formData.modelFileName}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAddGitHubFeatures;