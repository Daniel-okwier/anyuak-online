import React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi'; // Import the correct checkmark icon

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

const theme = {
  primary: '#64b5f6',
  primaryDarker: '#42a5f5',
};

function CourseDetails() {
  const { courseId } = useParams();

  const findCourse = (id) => {
    const courses = [
      { id: '1', title: 'Cosmic Navigation', progress: 0.3, summary: 'Learn the fundamentals of navigating through the cosmos.',
        lessons: [{ title: 'Intro', resource: '' }, { title: 'Lesson 2', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
      { id: '2', title: 'Stellar Physics', progress: 0.7, summary: 'Explore the fascinating physics governing stars and their life cycles.',
        lessons: [{ title: 'Lesson 1', resource: '' }, { title: 'Fusion', resource: '' }, { title: 'Class', resource: '' }], currentLessonIndex: 1, completedLessons: [0] },
      { id: '3', title: 'Nebula Exploration', progress: 0.1, summary: 'Discover the beauty and science behind nebulae.',
        lessons: [{ title: 'Types', resource: '' }, { title: 'Emission', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
      { id: '4', title: 'Galaxy Formation', progress: 0.5, summary: 'Understand how galaxies are born and evolve over cosmic time.',
        lessons: [{ title: 'Early', resource: '' }, { title: 'Spiral', resource: '' }], currentLessonIndex: 0, completedLessons: [] },
      { id: '5', title: 'Dark Matter Studies', progress: 0.9, summary: 'Delve into the mysterious world of dark matter.',
        lessons: [{ title: 'Evidence', resource: '' }, { title: 'Theories', resource: '' }], currentLessonIndex: -1, completedLessons: [0, 1] },
      { id: '6', title: 'Exoplanetary Systems', progress: 0.2, summary: 'Explore the diversity of planets orbiting stars beyond our Sun.',
        lessons: [{ title: 'Detection', resource: '' }, { title: 'Types', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
      { id: '7', title: 'Introduction to Astrobiology', progress: 0.6, summary: 'An introduction to the study of life in the universe.',
        lessons: [{ title: 'What is Life', resource: '' }, { title: 'Building Blocks', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
      { id: '8', title: 'Principles of Space Travel', progress: 0.4, summary: 'Learn the basic principles and technologies behind space travel.',
        lessons: [{ title: 'Propulsion', resource: '' }, { title: 'Orbit', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
      { id: '9', title: 'The Enigmatic Black Holes', progress: 0.8, summary: 'Unravel the secrets of black holes and their profound effects on spacetime.',
        lessons: [{ title: 'Formation', resource: '' }, { title: 'Anatomy', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
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
        {/* "View All Lessons" functionality is integrated into the lessons list */}
      </NavigationButtons>

      {course.lessons && course.lessons.length > 0 && (
        <>
          <LessonsListTitle>Lessons</LessonsListTitle>
          <LessonsList>
            {course.lessons.map((lesson, index) => (
              <LessonItem
                key={index}
                theme={theme}
                onClick={() => handleLessonClick(lesson.resource)}
                isCompleted={isLessonCompleted(index)}
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