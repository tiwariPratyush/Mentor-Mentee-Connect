import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConnectedStudents, getUpcomingClasses } from '../../../services/api'; // Adjust the import path as needed

const Stats = () => {
  const [connectedStudents, setConnectedStudents] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentsData = await getConnectedStudents();
        setConnectedStudents(studentsData.students.length);

        const classesData = await getUpcomingClasses();
        setUpcomingClasses(classesData.classes.length);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleUpcomingClassesClick = () => {
    navigate('/mentor/dashboard/calendar'); // Adjust this path as needed
  };

  const handleConnectedStudents = () => {
    navigate('/mentor/dashboard/students');
  };

  return (
    <div>
      <h2>Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Connected Students</h3>
          <p className="stat-value" onClick={handleConnectedStudents} style={{ cursor: 'pointer' }}>{connectedStudents}</p>
        </div>
        <div className="stat-card" onClick={handleUpcomingClassesClick} style={{ cursor: 'pointer' }}>
          <h3>Upcoming Classes</h3>
          <p className="stat-value">{upcomingClasses}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Sessions</h3>
          <p className="stat-value">156</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-value">4.8</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;