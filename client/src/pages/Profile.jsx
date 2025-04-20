// src/pages/Profile.jsx
import React from 'react';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi'; // Example user icon

const ProfileContainer = styled(motion.div)`
  flex-grow: 1;
  padding: 40px;
  background-color: #111;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #ddd;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const AvatarPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #333;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #ccc;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  color: #ddd;
  margin-bottom: 10px;
`;

const ProgressOverviewTitle = styled.h2`
  font-size: 1.8rem;
  color: #ddd;
  margin-top: 30px;
  margin-bottom: 15px;
  align-self: flex-start;
  margin-left: 10%;
`;

const CoursesProgressList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 80%;
`;

const CourseProgressItem = styled.li`
  background-color: #222;
  color: #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseTitleText = styled.span`
  font-size: 1.1rem;
`;

const ProgressBarContainer = styled.div`
  background-color: #333;
  border-radius: 5px;
  width: 150px;
  height: 10px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background-color: ${(props) => props.theme.primary};
  height: 100%;
  border-radius: 5px;
  width: ${(props) => props.progress * 100}%;
  transition: width 0.3s ease-in-out;
`;

const theme = {
  primary: '#64b5f6',
};

function Profile() {
  // Mock user data
  const user = {
    name: 'Cosmic Explorer',
    avatarUrl: null,
  };

  // Mock course data (same as in Dashboard for now)
  const courses = [
    { id: 1, title: 'Cosmic Navigation', progress: 0.3, color1: '#64b5f6', color2: '#2196f3', summary: 'Learn the fundamentals of navigating through the cosmos.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
    { id: 2, title: 'Stellar Physics', progress: 0.7, color1: '#aed581', color2: '#689f38', summary: 'Explore the fascinating physics governing stars and their life cycles.', lessons: [], currentLessonIndex: 1, completedLessons: [0] },
    { id: 3, title: 'Nebula Exploration', progress: 0.1, color1: '#f48fb1', color2: '#e91e63', summary: 'Discover the beauty and science behind nebulae.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
    { id: 4, title: 'Galaxy Formation', progress: 0.5, color1: '#ffb74d', color2: '#f57c00', summary: 'Understand how galaxies are born and evolve over cosmic time.', lessons: [], currentLessonIndex: 0, completedLessons: [] },
    { id: 5, title: 'Dark Matter Studies', progress: 0.9, color1: '#90caf9', color2: '#1e88e5', summary: 'Delve into the mysterious world of dark matter.', lessons: [], currentLessonIndex: -1, completedLessons: [0, 1] },
    { id: 6, title: 'Exoplanetary Systems', progress: 0.2, color1: '#80cbc4', color2: '#00897b', summary: 'Explore the diversity of planets orbiting stars beyond our Sun.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
    { id: 7, title: 'Introduction to Astrobiology', progress: 0.6, color1: '#ce93d8', color2: '#8e24aa', summary: 'An introduction to the study of life in the universe.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
    { id: 8, title: 'Principles of Space Travel', progress: 0.4, color1: '#ffcc80', color2: '#ffa000', summary: 'Learn the basic principles and technologies behind space travel.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
    { id: 9, title: 'The Enigmatic Black Holes', progress: 0.8, color1: '#bcaaa4', color2: '#424242', summary: 'Unravel the secrets of black holes and their profound effects on spacetime.', lessons: [], currentLessonIndex: -1, completedLessons: [] },
  ];

  return (
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileTitle>Your Profile</ProfileTitle>
      <UserInfoContainer>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="User Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px' }} />
        ) : (
          <AvatarPlaceholder>{user.name.slice(0, 2).toUpperCase()}</AvatarPlaceholder>
        )}
        <UserName>{user.name}</UserName>
      </UserInfoContainer>

      <ProgressOverviewTitle>Your Course Progress</ProgressOverviewTitle>
      <CoursesProgressList>
        {courses.map((course) => (
          <CourseProgressItem key={course.id}>
            <CourseTitleText>{course.title}</CourseTitleText>
            <ProgressBarContainer>
              <ProgressBar progress={course.progress} theme={theme} />
            </ProgressBarContainer>
            <span>{(course.progress * 100).toFixed(0)}%</span>
          </CourseProgressItem>
        ))}
      </CoursesProgressList>
    </ProfileContainer>
  );
}

export default Profile;