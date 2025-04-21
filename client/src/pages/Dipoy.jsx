import React from 'react';
import AIQuizGenerator from '../components/AIQuizGenerator';
import AISummarizer from '../components/AISummarizer'; 
import styled from 'styled-components';

const AIDedicationContainer = styled.div`
  padding: 40px;
  background-color: #1a1a2e;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AIPageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #64b5f6;
  text-align: center;
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 20px;
  text-align: center;
`;

function Dipoy() {
  return (
    <AIDedicationContainer>
      <AIPageTitle>AI-Powered Tools</AIPageTitle>
      <WelcomeText>Welcome to Dipoy!</WelcomeText>
      <AIQuizGenerator />
      <AISummarizer /> {/* Render the summarizer component */}
      {/* We will add other AI tools here later */}
    </AIDedicationContainer>
  );
}

export default Dipoy;