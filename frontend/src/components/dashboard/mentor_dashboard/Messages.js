import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { getConnectedStudents, getMessages, sendMessage as apiSendMessage } from '../../../services/api';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import styles from '../../../styles/mentor_dashboard/Messages.module.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { socket, joinChatRoom, leaveChatRoom, sendMessage } = useSocket();
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatWindows, setChatWindows] = useState({});

  const fetchConnectedStudents = async () => {
    try {
      const response = await getConnectedStudents();
      setConnectedStudents(response.students);
    } catch (error) {
      console.error('Error fetching connected students:', error);
    }
  };

  const fetchMessages = async (studentId) => {
    try {
      const fetchedMessages = await getMessages(user.id, studentId);
      setChatWindows(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], messages: fetchedMessages }
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
    fetchConnectedStudents();
    if (socket) {
      socket.on('newMessage', updateMessages);
    }
    return () => {
      if (socket) {
        socket.off('newMessage', updateMessages);
      }
    };
  }, [socket, updateMessages]);

  const handleSelectStudent = (student) => {
    if (selectedStudent) {
      const prevRoomId = [user.id, selectedStudent._id].sort().join('-');
      leaveChatRoom(prevRoomId);
    }
    setSelectedStudent(student);
    if (!chatWindows[student._id]) {
      setChatWindows(prev => ({
        ...prev,
        [student._id]: { messages: [], inputValue: '' }
      }));
      fetchMessages(student._id);
    }
    const newRoomId = [user.id, student._id].sort().join('-');
    joinChatRoom(newRoomId);
  };

  const handleSendMessage = async (content) => {
    if (selectedStudent) {
      const roomId = [user.id, selectedStudent._id].sort().join('-');
      const messageData = {
        sender: user.id,
        receiver: selectedStudent._id,
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

  const handleInputChange = (studentId, value) => {
    setChatWindows(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], inputValue: value }
    }));
  };

  return (
    <div className={styles.messagesContainer}>
      <UserList
        users={connectedStudents}
        selectedUser={selectedStudent}
        onSelectUser={handleSelectStudent}
      />
      {selectedStudent && (
        <ChatWindow
          messages={chatWindows[selectedStudent._id]?.messages || []}
          currentUser={user}
          otherUser={selectedStudent}
          onSendMessage={handleSendMessage}
          inputValue={chatWindows[selectedStudent._id]?.inputValue || ''}
          onInputChange={(value) => handleInputChange(selectedStudent._id, value)}
        />
      )}
    </div>
  );
};

export default Messages;