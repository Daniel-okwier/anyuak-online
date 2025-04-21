import React, { useState } from 'react';
import { styled } from 'styled-components';
import axios from 'axios';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #111;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  color: #eee;
  margin-bottom: 5px;
`;

const Input = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #222;
  color: #ddd;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #5cb85c;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #4cae4c;
  }
`;

const Message = styled.div`
  margin-top: 15px;
  color: #5cb85c;
`;

const ErrorMessage = styled.div`
  margin-top: 15px;
  color: #d9534f;
`;

function TeacherRequestForm() {
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ bio, experience, areasOfInterest: areasOfInterest.split(',').map(item => item.trim()) });

      const response = await axios.post('/api/teacher-requests/request', body, config);
      setMessage(response.data.msg);
      setBio('');
      setExperience('');
      setAreasOfInterest('');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred while submitting the request.');
      console.error('Teacher request submission error:', err);
    }
  };

  return (
    <FormContainer>
      <h2>Teacher Authorization Request</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="bio">Bio:</Label>
          <Input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            placeholder="Tell us a bit about yourself."
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="experience">Teaching Experience:</Label>
          <Input
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows="4"
            placeholder="Describe your teaching experience."
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="areasOfInterest">Areas of Interest (comma-separated):</Label>
          <Input
            id="areasOfInterest"
            value={areasOfInterest}
            onChange={(e) => setAreasOfInterest(e.target.value)}
            type="text"
            placeholder="e.g., Math, Science, Programming"
          />
        </FormGroup>
        <Button type="submit">Submit Request</Button>
        {message && <Message>{message}</Message>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </FormContainer>
  );
}

export default TeacherRequestForm;