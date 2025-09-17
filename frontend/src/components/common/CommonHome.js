import React from 'react';
import '../../styles/CommonHome.css';

const CommonHome = () => {
  return (
    <div className="common-home">
      <h1 className="main-heading">Welcome to MentorConnect</h1>
      <p className="subtitle">Connecting Mentors and Mentees for Success</p>
      <div className="features">
        <div className="feature">
          <h2>Find Your Mentor</h2>
          <p>Connect with experienced professionals in your field</p>
        </div>
        <div className="feature">
          <h2>Share Your Knowledge</h2>
          <p>Become a mentor and help others grow</p>
        </div>
        <div className="feature">
          <h2>Grow Your Skills</h2>
          <p>Learn from the best and advance your career</p>
        </div>
      </div>
      <button className="cta-button">Get Started</button>
    </div>
  );
};

export default CommonHome;