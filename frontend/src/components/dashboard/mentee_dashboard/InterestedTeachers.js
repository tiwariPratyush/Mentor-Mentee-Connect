import React, { useState, useEffect, useCallback } from 'react';
import { getMatchingMentors, sendConnectionRequest } from '../../../services/api';
import '../../../styles/mentee_dashboard/InterestedTeachers.css';

const InterestedTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchMatchingMentors = async () => {
      try {
        const data = await getMatchingMentors();
        setTeachers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching matching mentors:', err);
        setError('Failed to fetch matching mentors');
        setLoading(false);
      }
    };

    fetchMatchingMentors();
  }, []);

  const handleTeacherClick = useCallback((teacher) => {
    setSelectedTeacher(teacher);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedTeacher(null);
  }, []);

  const handleConnectRequest = useCallback(async (teacherId) => {
    try {
      setIsConnecting(true);
      const response = await sendConnectionRequest(teacherId);
      alert(response.message);
      handleClosePopup();
    } catch (error) {
      console.error('Error sending connection request:', error);
      if (error.message === 'A connection request is already pending') {
        alert('A connection request is already pending for this teacher.');
      } else {
        alert('Failed to send connection request. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [handleClosePopup]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="interested-teachers-container">
      <h2>Teachers You Might Be Interested In</h2>
      <div className="teachers-grid">
        {teachers.map((teacher) => (
          <div 
            key={teacher._id} 
            className="teacher-card"
            onClick={() => handleTeacherClick(teacher)}
          >
            <h3>{teacher.name}</h3>
            <p>Expert in {teacher.subjectExpertise}</p>
          </div>
        ))}
      </div>
      {selectedTeacher && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={handleClosePopup}>&times;</button>
            <div className="teacher-header">
              <h2>{selectedTeacher.name}</h2>
              <button 
                className="connect-btn" 
                onClick={() => handleConnectRequest(selectedTeacher.user)}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect to Teacher'}
              </button>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Teaching Language:</span>
                <span className="detail-value">{selectedTeacher.teachingLanguage}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Highest Degree:</span>
                <span className="detail-value">{selectedTeacher.highestDegree}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Subject Expertise:</span>
                <span className="detail-value">{selectedTeacher.subjectExpertise}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Institute:</span>
                <span className="detail-value">{selectedTeacher.institute}</span>
              </div>
            </div>
            <div className="bio-section">
              <h3>Bio</h3>
              <p>{selectedTeacher.bio}</p>
            </div>
            {selectedTeacher.achievements && (
              <div className="achievements-section">
                <h3>Achievements</h3>
                <p>{selectedTeacher.achievements}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestedTeachers;