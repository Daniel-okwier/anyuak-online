import styled from 'styled-components';

const QuizGeneratorContainer = styled.div`
  padding: 40px;
  background-color: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const GeneratorTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  color: #64b5f6;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #29293d;
  color: #eee;
  font-size: 1rem;
  box-sizing: border-box;
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg fill="%23eee" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
`;

const GenerateButton = styled.button`
  background-color: #64b5f6;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #42a5f5;
  }
`;

const OutputContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #29293d;
  border-radius: 5px;
  border: 1px solid #333;
`;

const OutputTitle = styled.h3`
  font-size: 1.5rem;
  color: #64b5f6;
  margin-bottom: 15px;
  text-align: center;
`;

const GeneratedQuestion = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 5px;
  background-color: #1a1a2e;
  border: 1px solid #333;
`;

const QuestionText = styled.p`
  font-size: 1.1rem;
  color: #eee;
  margin-bottom: 10px;
`;

const Option = styled.li`
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 5px;
`;

export {
  QuizGeneratorContainer,
  GeneratorTitle,
  InputGroup,
  Label,
  Input,
  Select,
  GenerateButton,
  OutputContainer,
  OutputTitle,
  GeneratedQuestion,
  QuestionText,
  Option,
};