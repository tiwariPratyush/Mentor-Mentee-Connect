import React, { useState, useCallback } from 'react';
import VideoCall from '../../shared/VideoCall';

const MenteeClasses = () => {
  const [classLink, setClassLink] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinClass = () => {
    if (classLink) {
      setIsJoined(true);
    }
  };

  const handleEndCall = useCallback(() => {
    setIsJoined(false);
    setClassLink('');
  }, []);

  return (
    <div className="mentee-classes">
      {!isJoined ? (
        <>
          <input
            type="text"
            value={classLink}
            onChange={(e) => setClassLink(e.target.value)}
            placeholder="Enter class link"
          />
          <button onClick={handleJoinClass}>Join Class</button>
        </>
      ) : (
        <VideoCall roomId={classLink} isMentor={false} onEndCall={handleEndCall} />
      )}
    </div>
  );
};

export default MenteeClasses;