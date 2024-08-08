import React, { useState } from 'react';
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

const ModalAddGitHubRepo = ({ toggle }) => {
  const [activeAlg, setActiveAlg] = useState({ url: "" });
  const [responseData, setResponseData] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);

  const handleChange = (e) => {
    setActiveAlg({ ...activeAlg, url: e.target.value });
  };

  const convertToArray = (obj) => {
    const result = [];
    for (const branch in obj) {
        if (Array.isArray(obj[branch])) {
            obj[branch].forEach(commit => {
                commit.branch = branch;
                result.push(commit);
            });
        }
    }
    return result;
  };

  const handleSubmit = () => {
    const data = { url: activeAlg.url };
    axios.post('/api/v1/get_github_info/', data)
    .then(response => {
      const result = convertToArray(response.data['data']);
      setResponseData(result); // Store the response data
    })
    .catch(error => {
      console.error('Error making POST request:', error);
    });
  };

  const handleCommitClick = (commit) => {
    console.log('Selected commit:', commit);
    setSelectedCommit(commit);
    axios.post('/api/v1/set_github_repo/', commit)
    .then(response => {
      console.log('Response:', response)
    })
    .catch(error => {
      console.error('Error making POST request:', error);
    });
  };

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add GitHub Repo</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="ml-title">Enter URL for repo</Label>
            <Input
              type="text"
              id="url-repo"
              name="URL_repo"
              value={activeAlg.url}
              onChange={handleChange}
            />
          </FormGroup>
          {/* Add other form fields as needed */}
        </Form>
        {responseData && (
  <ul style={{ marginTop: '20px' }}>
    {responseData.map((commit, index) => (
      <li
        key={index}
        style={{
          cursor: 'pointer',
          backgroundColor: selectedCommit === commit.commit_number ? 'lightblue' : 'white',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => handleCommitClick(commit)}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'lightgray'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = selectedCommit === commit.commit_number ? 'lightblue' : 'white'}
      >
        <p><strong>Branch:</strong> {commit.branch}</p>
        <p><strong>Commit Number:</strong> {commit.commit_number}</p>
        <p><strong>Author:</strong> {commit.author}</p>
        <p><strong>Message:</strong> {commit.message}</p>
        <p><strong>Date:</strong> {commit.date}</p>
      </li>
    ))}
  </ul>
)}
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

export default ModalAddGitHubRepo;