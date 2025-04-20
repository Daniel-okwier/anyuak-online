import React from 'react';
import { styled, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled(motion.div)`
  flex-grow: 1;
  padding: 20px;
  background-color: #000;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  position: relative;
  min-height: 100vh;
`;

const twinkle = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const Star = styled.div`
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  opacity: ${(props) => props.opacity};
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation: ${twinkle} ${(props) => props.duration}s infinite ease-in-out;
`;

const CentralStar = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(to right bottom, #fdd835, #ffeb3b);
  box-shadow: 0 0 20px #ffeb3b, 0 0 40px #fdd835;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  z-index: 2;
`;

const CourseOrbit = styled.div`
  position: relative; /* Position relative to DashboardContainer */
  width: 300px; /* Adjust for orbit size */
  height: 300px; /* Adjust for orbit size */
  z-index: 1;
`;

const CourseStarWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Styles for positioning based on angle will be applied here */
`;

const CourseStarContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, ${(props) => props.color1} 0%, ${(props) => props.color2} 100%);
  box-shadow: 0 0 15px ${(props) => props.color2};
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 2;
  position: relative; /* For tooltip positioning */

  &:hover {
    box-shadow: 0 0 25px ${(props) => props.color2};
    transform: scale(1.05);

    &::before {
      content: '${(props) => props.title}';
      position: absolute;
      bottom: -30px; /* Adjust as needed */
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.9rem;
      white-space: nowrap;
      z-index: 3;
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    }
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    white-space: nowrap;
    z-index: 3;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  }
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Behind the text */
`;

const Circle = styled.circle`
  fill: transparent;
  stroke-width: 5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.6 + 0.4;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    stars.push(<Star key={i} size={size} opacity={opacity} top={top} left={left} duration={duration} />);
  }
  return stars;
};

function Dashboard() {
  const courses = [
    { id: 1, title: 'Cosmic Navigation', progress: 0.3, color1: '#64b5f6', color2: '#2196f3', summary: 'Learn the fundamentals of navigating through the cosmos.',
      lessons: [{ title: 'Intro', resource: '' }, { title: 'Lesson 2', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
    { id: 2, title: 'Stellar Physics', progress: 0.7, color1: '#aed581', color2: '#689f38', summary: 'Explore the fascinating physics governing stars and their life cycles.',
      lessons: [{ title: 'Lesson 1', resource: '' }, { title: 'Fusion', resource: '' }, { title: 'Class', resource: '' }], currentLessonIndex: 1, completedLessons: [0] }, // Lesson 1 completed
    { id: 3, title: 'Nebula Exploration', progress: 0.1, color1: '#f48fb1', color2: '#e91e63', summary: 'Discover the beauty and science behind nebulae.',
      lessons: [{ title: 'Types', resource: '' }, { title: 'Emission', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
    { id: 4, title: 'Galaxy Formation', progress: 0.5, color1: '#ffb74d', color2: '#f57c00', summary: 'Understand how galaxies are born and evolve over cosmic time.',
      lessons: [{ title: 'Early', resource: '' }, { title: 'Spiral', resource: '' }], currentLessonIndex: 0, completedLessons: [] },
    { id: 5, title: 'Dark Matter Studies', progress: 0.9, color1: '#90caf9', color2: '#1e88e5', summary: 'Delve into the mysterious world of dark matter.',
      lessons: [{ title: 'Evidence', resource: '' }, { title: 'Theories', resource: '' }], currentLessonIndex: -1, completedLessons: [0, 1] }, // Both lessons completed
    { id: 6, title: 'Exoplanetary Systems', progress: 0.2, color1: '#80cbc4', color2: '#00897b', summary: 'Explore the diversity of planets orbiting stars beyond our Sun.',
      lessons: [{ title: 'Detection', resource: '' }, { title: 'Types', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
    { id: 7, title: 'Introduction to Astrobiology', progress: 0.6, color1: '#ce93d8', color2: '#8e24aa', summary: 'An introduction to the study of life in the universe.',
      lessons: [{ title: 'What is Life', resource: '' }, { title: 'Building Blocks', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
    { id: 8, title: 'Principles of Space Travel', progress: 0.4, color1: '#ffcc80', color2: '#ffa000', summary: 'Learn the basic principles and technologies behind space travel.',
      lessons: [{ title: 'Propulsion', resource: '' }, { title: 'Orbit', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
    { id: 9, title: 'The Enigmatic Black Holes', progress: 0.8, color1: '#bcaaa4', color2: '#424242', summary: 'Unravel the secrets of black holes and their profound effects on spacetime.',
      lessons: [{ title: 'Formation', resource: '' }, { title: 'Anatomy', resource: '' }], currentLessonIndex: -1, completedLessons: [] },
  ];

  const numberOfStars = 200;
  const stars = generateStars(numberOfStars);
  const orbitRadius = 150;
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      {stars}
      <CentralStar>
        Your Journey
      </CentralStar>

      <CourseOrbit style={{ width: `${orbitRadius * 2}px`, height: `${orbitRadius * 2}px` }}>
        {courses.map((course, index) => {
          const angle = (index / courses.length) * 2 * Math.PI;
          const x = orbitRadius * Math.cos(angle);
          const y = orbitRadius * Math.sin(angle);

          const handleCourseClick = () => {
            navigate(`/course/${course.id}`);
          };

          return (
            <CourseStarWrapper
              key={course.id}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            >
              <CourseStarContainer
                color1={course.color1}
                color2={course.color2}
                title={course.title}
                onClick={handleCourseClick}
              >
                <ProgressRing>
                  <Circle
                    cx="40"
                    cy="40"
                    r={40 - 5 / 2}
                    stroke={course.color2}
                    strokeDasharray={2 * Math.PI * (40 - 5 / 2)}
                    strokeDashoffset={2 * Math.PI * (40 - 5 / 2) * (1 - course.progress)}
                    style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
                  />
                  <Circle
                    cx="40"
                    cy="40"
                    r={40 - 5 / 2}
                    stroke="#333" /* Background track color */
                    strokeDasharray={2 * Math.PI * (40 - 5 / 2)}
                    strokeDashoffset={0}
                    opacity="0.3"
                  />
                </ProgressRing>
                {course.title.split(' ').map((word) => word[0]).join('')}
              </CourseStarContainer>
            </CourseStarWrapper>
          );
        })}
      </CourseOrbit>
    </DashboardContainer>
  );
}

export default Dashboard;