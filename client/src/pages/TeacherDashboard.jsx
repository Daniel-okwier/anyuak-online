import React from 'react';
import { styled } from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #111;
  color: #eee;
`;

const Title = styled.h2`
  color: #eee;
  margin-bottom: 20px;
`;

const WelcomeMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const DashboardSection = styled.div`
  background-color: #222;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const SectionTitle = styled.h3`
  color: #ddd;
  margin-top: 0;
  margin-bottom: 10px;
`;

function TeacherDashboard() {
  // Assuming you have access to the logged-in teacher's information
  const teacherName = localStorage.getItem('username') || 'Teacher'; // Example

  return (
    <DashboardContainer>
      <Title>Teacher Dashboard</Title>
      <WelcomeMessage>Welcome, {teacherName}!</WelcomeMessage>

      <DashboardSection>
        <SectionTitle>Course Management</SectionTitle>
        <p>Here you can manage your created courses, including adding new lessons, editing content, and tracking student progress.</p>
        {/* Add links or components for course management */}
        <ul>
          <li><a href="/teacher/courses/create">Create New Course</a></li>
          <li><a href="/teacher/courses/manage">Manage Courses</a></li>
        </ul>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Quiz Management</SectionTitle>
        <p>Create and manage quizzes for your courses to assess student understanding.</p>
        {/* Add links or components for quiz management */}
        <ul>
          <li><a href="/teacher/quizzes/create">Create New Quiz</a></li>
          <li><a href="/teacher/quizzes/manage">Manage Quizzes</a></li>
        </ul>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Student Interactions</SectionTitle>
        <p>Interact with your students, answer questions, and provide feedback.</p>
        {/* Add components or links for student interaction */}
        <ul>
          <li><a href="/teacher/forums">Student Forums</a></li>
          <li><a href="/teacher/messages">Direct Messages</a></li>
        </ul>
      </DashboardSection>

      {/* Add more sections as needed */}
    </DashboardContainer>
  );
}

export default TeacherDashboard;