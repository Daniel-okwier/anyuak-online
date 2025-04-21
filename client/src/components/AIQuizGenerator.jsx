import React, { useState } from 'react';
import {
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
} from './AIQuizGenerator.styles'; // Assuming you created this file

function AIQuizGenerator() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleGenerateQuiz = () => {
    // In a real application, you would send this data to an AI service
    // and update the 'generatedQuiz' state with the response.
    // For now, let's simulate a generated quiz.
    const mockQuiz = {
      title: `Quiz on ${topic}`,
      questions: [
        {
          question: `Mock Question 1 about ${topic}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'A',
        },
        {
          question: `Another Mock Question 2 about ${topic}?`,
          options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
          correctAnswer: 'C',
        },
        // ... more mock questions based on numQuestions and difficulty
      ],
    };
    setGeneratedQuiz(mockQuiz);
  };

  return (
    <QuizGeneratorContainer>
      <GeneratorTitle>Nebula of Challenges: Generate Your Quiz</GeneratorTitle>

      <InputGroup>
        <Label htmlFor="topic">Topic:</Label>
        <Input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter quiz topic"
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="numQuestions">Number of Questions:</Label>
        <Select
          id="numQuestions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </Select>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="difficulty">Difficulty Level:</Label>
        <Select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </Select>
      </InputGroup>

      <GenerateButton onClick={handleGenerateQuiz}>Generate Quiz</GenerateButton>

      {generatedQuiz && (
        <OutputContainer>
          <OutputTitle>{generatedQuiz.title}</OutputTitle>
          {generatedQuiz.questions.map((question, index) => (
            <GeneratedQuestion key={index}>
              <QuestionText>{index + 1}. {question.question}</QuestionText>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <Option key={optionIndex}>{String.fromCharCode(65 + optionIndex)}. {option}</Option>
                ))}
              </ul>
              {/* For now, we're just displaying the correct answer for demonstration */}
              <p style={{ fontSize: '0.9rem', color: '#4caf50' }}>Correct Answer: {question.correctAnswer}</p>
            </GeneratedQuestion>
          ))}
        </OutputContainer>
      )}
    </QuizGeneratorContainer>
  );
}

export default AIQuizGenerator;