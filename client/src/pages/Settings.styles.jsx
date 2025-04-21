import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 40px;
  background-color: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SettingsTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  color: #f0db4f; /* A different color for settings */
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #29293d;
  color: #eee;
  font-size: 1rem;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #29293d;
  color: #eee;
  font-size: 1rem;
  box-sizing: border-box;
  min-height: 150px;
`;

const SaveButton = styled.button`
  background-color: #f0db4f;
  color: #1a1a2e;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #e0c23b;
  }
`;

const FeedbackMessage = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  text-align: center;
`;

const SuccessMessage = styled(FeedbackMessage)`
  color: #4caf50;
`;

const ErrorMessage = styled(FeedbackMessage)`
  color: #f44336;
`;

export {
  SettingsContainer,
  SettingsTitle,
  InputGroup,
  Label,
  Input,
  TextArea,
  SaveButton,
  SuccessMessage,
  ErrorMessage,
};