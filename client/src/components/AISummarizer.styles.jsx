import styled from 'styled-components';

const SummarizerContainer = styled.div`
  padding: 40px;
  background-color: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SummarizerTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  color: #a78bfa; /* A different color to distinguish */
`;

const InputTextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #29293d;
  color: #eee;
  font-size: 1rem;
  box-sizing: border-box;
  min-height: 200px;
  margin-bottom: 20px;
`;

const SummarizeButton = styled.button`
  background-color: #a78bfa;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #8c6df7;
  }
`;

const SummaryOutputContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #29293d;
  border-radius: 5px;
  border: 1px solid #333;
`;

const SummaryOutputTitle = styled.h3`
  font-size: 1.5rem;
  color: #a78bfa;
  margin-bottom: 15px;
  text-align: center;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  line-height: 1.6;
  white-space: pre-wrap; /* Preserve line breaks */
`;

export {
  SummarizerContainer,
  SummarizerTitle,
  InputTextArea,
  SummarizeButton,
  SummaryOutputContainer,
  SummaryOutputTitle,
  SummaryText,
};