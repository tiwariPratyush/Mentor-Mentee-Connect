import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { getConnectedMentors, getMessages, sendMessage as apiSendMessage } from '../../../services/api';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import styles from '../../../styles/mentee_dashboard/Messages.module.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { socket, joinChatRoom, leaveChatRoom, sendMessage } = useSocket();
  const [connectedMentors, setConnectedMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [chatWindows, setChatWindows] = useState({});

  const fetchConnectedMentors = async () => {
    try {
      const response = await getConnectedMentors();
      setConnectedMentors(response.mentors);
    } catch (error) {
      console.error('Error fetching connected mentors:', error);
    }
  };

  const fetchMessages = async (mentorId) => {
    try {
      const fetchedMessages = await getMessages(user.id, mentorId);
      setChatWindows(prev => ({
        ...prev,
        [mentorId]: { ...prev[mentorId], messages: fetchedMessages }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const updateMessages = useCallback((message) => {
    const relevantUserId = message.sender === user.id ? message.receiver : message.sender;
    setChatWindows(prev => {
      const existingMessages = prev[relevantUserId]?.messages || [];
      const isNewMessage = !existingMessages.some(m => m._id === message._id);
      if (isNewMessage) {
        return {
          ...prev,
          [relevantUserId]: {
            ...prev[relevantUserId],
            messages: [...existingMessages, message]
          }
        };
      }
      return prev;
    });
  }, [user.id]);

  useEffect(() => {
    fetchConnectedMentors();
    if (socket) {
      socket.on('newMessage', updateMessages);
    }
    return () => {
      if (socket) {
        socket.off('newMessage', updateMessages);
      }
    };
  }, [socket, updateMessages]);

  const handleSelectMentor = (mentor) => {
    if (selectedMentor) {
      const prevRoomId = [user.id, selectedMentor._id].sort().join('-');
      leaveChatRoom(prevRoomId);
    }
    setSelectedMentor(mentor);
    if (!chatWindows[mentor._id]) {
      setChatWindows(prev => ({
        ...prev,
        [mentor._id]: { messages: [], inputValue: '' }
      }));
      fetchMessages(mentor._id);
    }
    const newRoomId = [user.id, mentor._id].sort().join('-');
    joinChatRoom(newRoomId);
  };

  const handleSendMessage = async (content) => {
    if (selectedMentor) {
      const roomId = [user.id, selectedMentor._id].sort().join('-');
      const messageData = {
        sender: user.id,
        receiver: selectedMentor._id,
        content,
        timestamp: new Date().toISOString()
      };
      try {
        const sentMessage = await apiSendMessage(messageData);
        sendMessage(roomId, sentMessage);
        updateMessages(sentMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = (mentorId, value) => {
    setChatWindows(prev => ({
      ...prev,
      [mentorId]: { ...prev[mentorId], inputValue: value }
    }));
  };

  return (
    <div className={styles.messagesContainer}>
      <UserList
        users={connectedMentors}
        selectedUser={selectedMentor}
        onSelectUser={handleSelectMentor}
      />
      {selectedMentor && (
        <ChatWindow
          messages={chatWindows[selectedMentor._id]?.messages || []}
          currentUser={user}
          otherUser={selectedMentor}
          onSendMessage={handleSendMessage}
          inputValue={chatWindows[selectedMentor._id]?.inputValue || ''}
          onInputChange={(value) => handleInputChange(selectedMentor._id, value)}
        />
      )}
    </div>
  );
};

export default Messages;