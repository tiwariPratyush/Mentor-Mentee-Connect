import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../styles/mentor_dashboard/Calendar.css';
import { scheduleClass, getUpcomingClasses, deleteClass } from '../../../services/api';

const MentorCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('10:00');
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingClasses();
  }, []);

  const fetchUpcomingClasses = async () => {
    try {
      setLoading(true);
      const response = await getUpcomingClasses();
      setScheduledClasses(response.classes || []);
    } catch (err) {
      setError('Failed to fetch upcoming classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setShowTimePicker(true);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSchedule = async () => {
    try {
      const newScheduledDate = new Date(date);
      const [hours, minutes] = time.split(':');
      newScheduledDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      await scheduleClass({ date: newScheduledDate, title: 'Scheduled Class' });
      await fetchUpcomingClasses();
      setShowTimePicker(false);
    } catch (err) {
      setError('Failed to schedule class');
      console.error(err);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
      await fetchUpcomingClasses();
    } catch (err) {
      setError('Failed to delete class');
      console.error(err);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && scheduledClasses.find(scheduledClass => 
      new Date(scheduledClass.date).toDateString() === date.toDateString()
    )) {
      return 'scheduled-date';
    }
  };

  return (
    <div className="mentor-calendar-container">
      <h1 className="calendar-title">Schedule Your Classes</h1>
      
      <div className="calendar-grid">
        <div className="calendar-card">
          <div className="card-header">Select Date</div>
          <div className="card-content">
            <Calendar 
              onChange={handleDateChange} 
              value={date}
              minDate={new Date()}
              tileClassName={tileClassName}
              className="custom-calendar"
            />
          </div>
        </div>
        
        {showTimePicker && (
          <div className="calendar-card">
            <div className="card-header">Select Time</div>
            <div className="card-content">
              <p>for {date.toDateString()}</p>
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="custom-time-picker"
              />
              <button onClick={handleSchedule} className="schedule-btn">
                Schedule Class
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="calendar-card scheduled-classes">
        <div className="card-header">Upcoming Classes</div>
        <div className="card-content">
          {loading ? (
            <p>Loading scheduled classes...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : scheduledClasses.length > 0 ? (
            <ul>
              {scheduledClasses.map((scheduledClass) => (
                <li key={scheduledClass._id}>
                  {new Date(scheduledClass.date).toLocaleString()}
                  <button onClick={() => handleDeleteClass(scheduledClass._id)} className="delete-btn">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming classes scheduled. Use the calendar to schedule your first class!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCalendar;