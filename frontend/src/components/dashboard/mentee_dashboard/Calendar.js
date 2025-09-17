import React, { useState, useEffect } from 'react';
import { getConnectedMentorsAndClasses } from '../../../services/api'; // Adjust the import path as needed
import '../../../styles/mentee_dashboard/Calendar.css'; // Make sure this CSS file exists

const Calendar = () => {
  const [mentorsWithClasses, setMentorsWithClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorsAndClasses = async () => {
      try {
        setLoading(true);
        const response = await getConnectedMentorsAndClasses();
        setMentorsWithClasses(response.mentorsWithClasses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mentors and classes:', err);
        setError('Failed to load mentors and classes. Please try again later.');
        setLoading(false);
      }
    };

    fetchMentorsAndClasses();
  }, []);

  if (loading) return <div className="loading">Loading mentors and classes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Your Mentors and Scheduled Classes</h2>
      {mentorsWithClasses.length === 0 ? (
        <p className="no-mentors">You don't have any connected mentors yet.</p>
      ) : (
        <div className="mentors-list">
          {mentorsWithClasses.map((mentor) => (
            <div key={mentor.id} className="mentor-item">
              <h3>{mentor.name}</h3>
              {mentor.scheduledClasses.length > 0 ? (
                <ul className="classes-list">
                  {mentor.scheduledClasses.map((cls) => (
                    <li key={cls.id} className="class-item">
                      <span className="class-title">{cls.title}</span>
                      <span className="class-date">{new Date(cls.date).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No scheduled classes for this mentor.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;