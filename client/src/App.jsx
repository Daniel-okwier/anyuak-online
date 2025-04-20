import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import AiTools from './pages/Dipoy';
import Logout from './pages/Logout';
import CourseDetails from './pages/CourseDetails'; // Import the CourseDetails component

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-tools" element={<AiTools />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/course/:courseId" element={<CourseDetails />} /> {/* Add this route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;