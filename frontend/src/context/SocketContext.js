import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  const connectSocket = useCallback(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return newSocket;
  }, []);

  useEffect(() => {
    const newSocket = connectSocket();

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [connectSocket]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join', user.id);
    }
  }, [socket, user]);

  const joinChatRoom = useCallback((roomId) => {
    if (socket) {
      socket.emit('join-chat-room', roomId);
    }
  }, [socket]);

  const leaveChatRoom = useCallback((roomId) => {
    if (socket) {
      socket.emit('leave-chat-room', roomId);
    }
  }, [socket]);

  const sendMessage = useCallback((roomId, messageData) => {
    if (socket) {
      socket.emit('sendMessage', { roomId, ...messageData });
    }
  }, [socket]);

  // Keeping video call related functions unchanged
  const createRoom = useCallback((roomId) => {
    if (socket) {
      socket.emit('create-room', roomId);
    }
  }, [socket]);

  const joinRoom = useCallback((roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  }, [socket]);

  const sendOffer = useCallback((offer, roomId) => {
    if (socket) {
      socket.emit('offer', { offer, roomId });
    }
  }, [socket]);

  const sendAnswer = useCallback((answer, roomId) => {
    if (socket) {
      socket.emit('answer', { answer, roomId });
    }
  }, [socket]);

  const sendIceCandidate = useCallback((candidate, roomId) => {
    if (socket) {
      socket.emit('ice-candidate', { candidate, roomId });
    }
  }, [socket]);

  const value = {
    socket,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    createRoom,
    joinRoom,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};