import React from 'react';

const Courses = () => {
  const courses = [
    { id: 1, title: 'Introduction to AI', description: 'Learn the basics of artificial intelligence.', duration: '4 weeks' },
    { id: 2, title: 'Web Development Basics', description: 'Get started with HTML, CSS, and JavaScript.', duration: '6 weeks' },
    { id: 3, title: 'Data Science with Python', description: 'Explore data analysis and visualization techniques.', duration: '8 weeks' },
  ];

  return (
    <div>
      <h2>Available Courses</h2>
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <button>Enroll</button>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;