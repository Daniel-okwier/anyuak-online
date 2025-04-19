import React from 'react';

const Dashboard = () => {
  const userStats = {
    completedCourses: 5,
    ongoingCourses: 2,
    quizzesTaken: 10,
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat">
          <h3>Completed Courses</h3>
          <p>{userStats.completedCourses}</p>
        </div>
        <div className="stat">
          <h3>Ongoing Courses</h3>
          <p>{userStats.ongoingCourses}</p>
        </div>
        <div className="stat">
          <h3>Quizzes Taken</h3>
          <p>{userStats.quizzesTaken}</p>
        </div>
      </div>
      <h3>Recent Activities</h3>
      <ul>
        <li>Completed "Introduction to AI"</li>
        <li>Started "Web Development Basics"</li>
        <li>Took Quiz on "HTML & CSS"</li>
      </ul>
    </div>
  );
};

export default Dashboard;