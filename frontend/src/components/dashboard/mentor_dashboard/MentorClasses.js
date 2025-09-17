import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import VideoCall from '../../shared/VideoCall';

const MentorClasses = () => {
  const [classLink, setClassLink] = useState('');
  const [isClassStarted, setIsClassStarted] = useState(false);

  const startClass = () => {
    const newClassLink = uuidv4();
    setClassLink(newClassLink);
    setIsClassStarted(true);
  };

  const handleEndCall = useCallback(() => {
    setIsClassStarted(false);
    setClassLink('');
  }, []);

  return (
    <div className="mentor-classes">
      {!isClassStarted ? (
        <button onClick={startClass}>Start a Class</button>
      ) : (
        <>
          <p>Class Link: {classLink}</p>
          <VideoCall roomId={classLink} isMentor={true} onEndCall={handleEndCall} />
        </>
      )}
    </div>
  );
};

export default MentorClasses;