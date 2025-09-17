import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import '../../styles/VideoCall.css';

const VideoCall = ({ roomId, isMentor, onEndCall }) => {
  const { socket, createRoom, joinRoom, sendOffer, sendAnswer, sendIceCandidate } = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Initializing...');
  const [isCallEnded, setIsCallEnded] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const endCall = useCallback(() => {
    setIsCallEnded(true);
    if (socket) {
      socket.emit('end-call', { roomId });
    }
    if (onEndCall) {
      onEndCall();
    }
  }, [socket, roomId, onEndCall]);

  const initializeStream = async (withVideo = true) => {
    try {
      const constraints = {
        audio: true,
        video: withVideo
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsVideoEnabled(withVideo);
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      if (withVideo) {
        console.log('Falling back to audio-only mode');
        return initializeStream(false);
      }
      throw error;
    }
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        sendIceCandidate(event.candidate, roomId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      setConnectionStatus(`ICE connection: ${pc.iceConnectionState}`);
    };

    pc.ontrack = (event) => {
      console.log('Received remote track');
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  }, [roomId, sendIceCandidate]);

  useEffect(() => {
    const initCall = async () => {
      try {
        console.log('Initializing call...');
        setConnectionStatus('Getting user media...');
        const stream = await initializeStream();
        
        setConnectionStatus('Creating peer connection...');
        peerConnection.current = createPeerConnection();

        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

        if (isMentor) {
          console.log('Creating room:', roomId);
          createRoom(roomId);
        } else {
          console.log('Joining room:', roomId);
          joinRoom(roomId);
        }

        if (socket) {
          socket.on('user-connected', async () => {
            console.log('User connected, creating offer');
            setConnectionStatus('Creating offer...');
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            sendOffer(offer, roomId);
          });

          socket.on('offer', async ({ offer }) => {
            console.log('Received offer, setting remote description');
            setConnectionStatus('Received offer, creating answer...');
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            sendAnswer(answer, roomId);
          });

          socket.on('answer', async ({ answer }) => {
            console.log('Received answer, setting remote description');
            setConnectionStatus('Received answer, setting remote description...');
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          });

          socket.on('ice-candidate', async ({ candidate }) => {
            console.log('Received ICE candidate');
            try {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error('Error adding received ice candidate', e);
            }
          });

          socket.on('call-ended', () => {
            setIsCallEnded(true);
            setConnectionStatus('Call ended');
            if (onEndCall) {
              onEndCall();
            }
          });
        }
      } catch (error) {
        console.error('Error in initCall:', error);
        setConnectionStatus(`Error: ${error.message}`);
      }
    };

    initCall();

    return () => {
      console.log('Cleaning up...');
      localStream?.getTracks().forEach(track => track.stop());
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (socket) {
        socket.off('user-connected');
        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
        socket.off('call-ended');
      }
    };
  }, [roomId, isMentor, socket, createRoom, joinRoom, sendOffer, sendAnswer, createPeerConnection, onEndCall]);

  if (isCallEnded) {
    return <div className="call-ended">The call has ended.</div>;
  }

  return (
    <div className="video-call-container">
      <div className="video-grid">
        <div className="video-wrapper">
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
          <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
        </div>
      </div>
      <div className="controls">
        <button 
          className={`control-button ${isMuted ? 'muted' : ''}`} 
          onClick={toggleMute}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button 
          className={`control-button ${isVideoEnabled ? '' : 'video-off'}`} 
          onClick={toggleVideo}
        >
          {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        {isMentor && (
          <button 
            className="control-button end-call"
            onClick={endCall}
          >
            End Call
          </button>
        )}
      </div>
      <div className="connection-status">Status: {connectionStatus}</div>
    </div>
  );
};

export default VideoCall;