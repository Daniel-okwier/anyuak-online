import React, { useState } from 'react';
import axios from 'axios';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-quiz', {
        topic,
        numQuestions,
        difficulty,
      });
      setGeneratedQuiz(response.data);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.message || 'Failed to generate quiz.');
      setGeneratedQuiz(null);
    } finally {
      setLoading(false);
    }
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

      <GenerateButton onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </GenerateButton>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {generatedQuiz && (
        <OutputContainer>
          <OutputTitle>{generatedQuiz.title || 'Generated Quiz'}</OutputTitle>
          {Array.isArray(generatedQuiz) ? (
            generatedQuiz.map((question, index) => (
              <GeneratedQuestion key={index}>
                <QuestionText>{index + 1}. {question.question}</QuestionText>
                <ul>
                  {question.options && question.options.map((option, optionIndex) => (
                    <Option key={optionIndex}>{String.fromCharCode(65 + optionIndex)}. {option}</Option>
                  ))}
                </ul>
                {question.answer && <p style={{ fontSize: '0.9rem', color: '#4caf50' }}>Correct Answer: {question.answer}</p>}
              </GeneratedQuestion>
            ))
          ) : (
            <p style={{ color: 'orange' }}>Error in quiz format received from the server.</p>
          )}
        </OutputContainer>
      )}
    </QuizGeneratorContainer>
  );
}

export default AIQuizGenerator;