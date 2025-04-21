import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const CourseDetailsContainer = styled(motion.div)`
  flex-grow: 1;
  padding: 40px;
  background-color: #111;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CourseTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #ddd;
`;

const CourseSummary = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #ccc;
  max-width: 800px;
  text-align: center;
`;

const ProgressContainer = styled.div`
  background-color: #333;
  border-radius: 10px;
  width: 80%;
  height: 20px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background-color: ${(props) => props.theme.primary};
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.progress * 100}%;
  transition: width 0.3s ease-in-out;
`;

const ProgressText = styled.span`
  font-size: 0.9rem;
  color: #ccc;
  margin-left: 10%;
  margin-bottom: 10px;
  align-self: flex-start;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const StartContinueButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.primaryDarker};
  }
`;

const LessonsListTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #ddd;
  align-self: flex-start;
  margin-left: 10%;
`;

const LessonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 80%;
`;

const LessonItem = styled.li`
  background-color: ${(props) => (props.isCompleted ? '#333' : '#222')};
  color: #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-left: 5px solid ${(props) => props.theme.primary};
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #333;
  }
`;

const CompletedIcon = styled(FiCheckCircle)`
  color: #4caf50;
  margin-left: 10px;
`;

const QuizContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #222;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
`;

const Question = styled.h3`
  font-size: 1.2rem;
  color: #ddd;
  margin-bottom: 15px;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const OptionItem = styled.li`
  background-color: #333;
  color: #eee;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #444;
  }
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.primaryDarker};
  }
`;

const CloseButton = styled.button`
  background-color: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  margin-top: 15px;

  &:hover {
    background-color: #b71c1c;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #222;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  color: #eee;
`;

const ResultsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ddd;
`;

const ScoreText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const theme = {
  primary: '#64b5f6',
  primaryDarker: '#42a5f5',
};

function CourseDetails() {
  const { courseId } = useParams();
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [mockUserPoints, setMockUserPoints] = useState(1000); // Mock user points

  const findCourse = (id) => {
    const courses = [
      {
        id: '1',
        title: 'Cosmic Navigation',
        progress: 0.3,
        summary: 'Learn the fundamentals of navigating through the cosmos.',
        lessons: [{ title: 'Intro', resource: '' }, { title: 'Lesson 2', resource: '' }],
        currentLessonIndex: -1,
        completedLessons: [],
        quiz: {
          title: 'Cosmic Navigation Quiz',
          questions: [
            {
              question: 'What is the speed of light in a vacuum?',
              options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
              correctAnswerIndex: 0,
              points: 10,
            },
            {
              question: 'Which galaxy is our solar system part of?',
              options: ['Andromeda', 'Triangulum', 'Milky Way', 'Whirlpool'],
              correctAnswerIndex: 2,
              points: 15,
            },
            {
              question: 'What is a light-year a measure of?',
              options: ['Time', 'Distance', 'Speed', 'Brightness'],
              correctAnswerIndex: 1,
              points: 10,
            },
          ],
        },
      },
      // Add other courses here...
    ];
    return courses.find((course) => course.id === courseId);
  };

  const course = findCourse(courseId);

  if (!course) {
    return (
      <CourseDetailsContainer>
        <p>Course not found.</p>
      </CourseDetailsContainer>
    );
  }

  const handleLessonClick = (resource) => {
    if (resource.startsWith('http') || resource.startsWith('https')) {
      window.open(resource, '_blank');
    } else if (resource.startsWith('/resources/')) {
      console.log('Navigating to internal resource:', resource);
      // In a real app, use navigation logic here
    } else {
      console.warn('Unknown resource type:', resource);
    }
  };

  const handleStartContinueClick = () => {
    if (course.lessons && course.lessons.length > 0) {
      const nextLessonIndex = course.currentLessonIndex === -1 ? 0 : course.currentLessonIndex;
      const resourceToNavigate = course.lessons[nextLessonIndex]?.resource;
      if (resourceToNavigate) {
        handleLessonClick(resourceToNavigate);
        console.log(`Navigating to lesson at index: ${nextLessonIndex}`);
      } else {
        console.warn('No resource found for the next lesson.');
      }
    }
  };

  const isLessonCompleted = (index) => {
    return course.completedLessons && course.completedLessons.includes(index);
  };

  const handleStartQuiz = () => {
    if (course.quiz) {
      setIsQuizActive(true);
      setQuizData(course.quiz);
      setUserAnswers(Array(course.quiz.questions.length).fill(null));
      setQuizResult(null); // Reset previous results
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;

    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswerIndex) {
        score += question.points;
      }
    });

    setQuizResult({ score: score, totalPoints: quizData.questions.reduce((sum, q) => sum + q.points, 0) });
    setIsQuizActive(false);

    // Simulate local point update
    setMockUserPoints((prevPoints) => prevPoints + score);
    console.log('Quiz submitted. Score:', score, 'Updated points:', mockUserPoints + score);
  };

  const handleCloseQuiz = () => {
    setIsQuizActive(false);
    setQuizResult(null);
  };

  if (isQuizActive && quizData) {
    return (
      <CourseDetailsContainer>
        <QuizContainer>
          <h2>{quizData.title}</h2>
          {quizData.questions.map((question, index) => (
            <div key={index}>
              <Question>{question.question}</Question>
              <OptionsList>
                {question.options.map((option, optionIndex) => (
                  <OptionItem
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(index, optionIndex)}
                    style={{
                      backgroundColor: userAnswers[index] === optionIndex ? '#555' : '#333',
                    }}
                  >
                    {option}
                  </OptionItem>
                ))}
              </OptionsList>
            </div>
          ))}
          <SubmitButton theme={theme} onClick={handleSubmitQuiz}>Submit Quiz</SubmitButton>
          <CloseButton onClick={handleCloseQuiz}>Close Quiz</CloseButton>
        </QuizContainer>
      </CourseDetailsContainer>
    );
  }

  if (quizResult) {
    return (
      <CourseDetailsContainer>
        <ResultsContainer>
          <ResultsTitle>Quiz Results</ResultsTitle>
          <ScoreText>Your Score: {quizResult.score} / {quizResult.totalPoints}</ScoreText>
          <CloseButton onClick={() => setQuizResult(null)}>Close Results</CloseButton>
        </ResultsContainer>
      </CourseDetailsContainer>
    );
  }

  return (
    <CourseDetailsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CourseTitle>{course.title}</CourseTitle>
      <CourseSummary>{course.summary}</CourseSummary>

      <ProgressText>Course Progress:</ProgressText>
      <ProgressContainer>
        <ProgressBar progress={course.progress} theme={theme} />
      </ProgressContainer>

      <NavigationButtons>
        {course.lessons && course.lessons.length > 0 && (
          <StartContinueButton theme={theme} onClick={handleStartContinueClick}>
            {course.currentLessonIndex === -1 ? 'Start Course' : 'Continue Course'}
          </StartContinueButton>
        )}
        {course.quiz && (
          <button onClick={handleStartQuiz}>Take Quiz</button>
        )}
      </NavigationButtons>

      {course.lessons && course.lessons.length > 0 && (
        <>
          <LessonsListTitle>Lessons</LessonsListTitle>
          <LessonsList>
            {course.lessons.map((lesson, index) => (
              <LessonItem
                key={index}
                isCompleted={isLessonCompleted(index)}
                onClick={() => handleLessonClick(lesson.resource)}
              >
                {lesson.title}
                {isLessonCompleted(index) && <CompletedIcon />}
              </LessonItem>
            ))}
          </LessonsList>
        </>
      )}
    </CourseDetailsContainer>
  );
}

export default CourseDetails;