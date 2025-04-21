import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import AiTools from './pages/Dipoy';
import Logout from './pages/Logout';
import CourseDetails from './pages/CourseDetails';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherRequestForm from './components/TeacherRequestForm';
import Signup from './pages/Signup'; // Import the Signup component
import Login from './pages/Login'; // Import the Login component

// Function to check if the user is an admin
const isAdmin = (user) => user && user.role === 'admin';

// Function to check if the user is an approved teacher
const isApprovedTeacher = (user) =>
  user && user.role === 'teacher' && user.isApproved;

// Function to check if the user is a regular student (or unapproved teacher)
const isStudentOrUnapprovedTeacher = (user) =>
  user && (user.role === 'student' || (user.role === 'teacher' && !user.isApproved));

// Protected Route component
const ProtectedRoute = ({ element, user, condition, redirectPath }) => {
  return condition(user) ? (
    element
  ) : (
    <Navigate to={redirectPath} replace />
  );
};

function App() {
  // Assume you have a way to get the current logged-in user
  const currentUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                element={<Profile />}
                user={currentUser}
                condition={(user) => !!user}
                redirectPath="/login"
              />
            }
          />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-tools" element={<AiTools />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/signup" element={<Signup />} /> {/* Add the signup route */}
          <Route path="/login" element={<Login />} /> {/* Add the login route */}

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                user={currentUser}
                condition={isAdmin}
                redirectPath="/login"
              />
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute
                element={<TeacherDashboard />}
                user={currentUser}
                condition={isApprovedTeacher}
                redirectPath="/login"
              />
            }
          />
          <Route
            path="/teacher/request"
            element={
              <ProtectedRoute
                element={<TeacherRequestForm />}
                user={currentUser}
                condition={isStudentOrUnapprovedTeacher}
                redirectPath="/login"
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

