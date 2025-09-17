import React, { useState, useEffect } from 'react';
import { getConnectedMentors } from '../../../services/api';
import '../../../styles/mentee_dashboard/Teachers.css';


const Teachers = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await getConnectedMentors();
      setMentors(response.mentors);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to fetch mentors');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your mentors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teachers-container">
      <h2 className="teachers-title">Your Connected Mentors</h2>
      {mentors.length === 0 ? (
        <p className="no-mentors">You haven't connected with any mentors yet.</p>
      ) : (
        <div className="mentors-grid">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-avatar">
                <img src={mentor.profilePicture || 'https://via.placeholder.com/150'} alt={mentor.name} />
              </div>
              <div className="mentor-info">
                <h3 className="mentor-name">{mentor.name}</h3>
                <p className="mentor-expertise">{mentor.subjectExpertise}</p>
                <p className="mentor-bio">{mentor.bio}</p>
              </div>
              <button className="contact-btn" >Contact </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers;