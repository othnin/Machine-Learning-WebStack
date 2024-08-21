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
import ModalAddGitHubFeatures from './Modal_AddGitHubFeatures'; 

const ModalAddGitHubRepo = ({ toggle, handleCloseAllModals }) => {
  const [gitUrl, setGitUrl] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState({
    commit_number: '',
    branch: '',
    author: '',
    date:'',
  });
  const [statusChoices, setStatusChoices] = useState([]);
  const [modalAddFeatures, setModalAddFeatures] = useState(false); // State to control the features modal

  const handleChange = (e) => {
    setGitUrl(e.target.value );
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

  //Result is an array of objects with the commits to display
  const handleSubmit = () => {
    const data = { url: gitUrl };
    axios.post('/api/v1/get_github_info/', data)
    .then(response => {
      const result = convertToArray(response.data['data']);
      console.log('Response:', result);
      setResponseData(result); // Store the response data
    })
    .catch(error => {
      console.error('Error making POST request:', error);
    });
  };


  const handleCommitClick = (commit) => {
    setSelectedCommit(commit);
    axios.post('/api/v1/set_github_repo/', {
      commit: commit,
      url: gitUrl
    })
    .then(response => {
      console.log('Response:', response)
      const statusArray = response.data.status;
      const statusChoices = statusArray.map(status => ({
        value: status[0],
        text: status[1]
      }));
      setStatusChoices(statusChoices);
      setModalAddFeatures(true); // Open the features modal
    })
    .catch(error => {
      console.error('Error making POST request:', error);
    });
  };

  const toggleAddFeatures = () => {
    console.log('toggleAddFeatures:', modalAddFeatures);
    setModalAddFeatures(!modalAddFeatures);
  };

  return (
    <>
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
                value={gitUrl}
                onChange={handleChange}
              />
            </FormGroup>
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
          {/* TODO: Fix submit button being disabled */}
         <Button color="primary" onClick={handleSubmit} disabled={modalAddFeatures}> 
            Submit 
          </Button>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>

      {modalAddFeatures && (
        <ModalAddGitHubFeatures
          toggle={toggleAddFeatures}
          statusChoices={statusChoices}
          initialData={{
            commit: selectedCommit,
            url: gitUrl,
          }}
          handleCloseAllModals={handleCloseAllModals}
        />
      )}
    </>
  );
};

export default ModalAddGitHubRepo;