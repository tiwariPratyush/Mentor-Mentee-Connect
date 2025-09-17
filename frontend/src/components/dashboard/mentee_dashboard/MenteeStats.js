import React from 'react';
import InterestedTeachers from './InterestedTeachers';
import '../../../styles/mentee_dashboard/MenteeDashboard.css'; // Make sure to create this CSS file

const Stats = () => {
  return (
    <div className="stats-container">
      <h2>Your Learning Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p className="stat-value">28</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Sessions</h3>
          <p className="stat-value">3</p>
        </div>
        <div className="stat-card">
          <h3>Hours Learned</h3>
          <p className="stat-value">42</p>
        </div>
        <div className="stat-card">
          <h3>Subjects Explored</h3>
          <p className="stat-value">5</p>
        </div>
        <div className="stat-card">
          <h3>Assignments Completed</h3>
          <p className="stat-value">18</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">85%</p>
        </div>
      </div>
      <br></br>
      <br></br>

      <InterestedTeachers />
    </div>
  );
};

export default Stats;