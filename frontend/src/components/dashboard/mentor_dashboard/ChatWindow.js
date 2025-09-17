import React, { useRef, useEffect } from 'react';
import styles from '../../../styles/mentor_dashboard/Messages.module.css';

const ChatWindow = ({ messages, currentUser, otherUser, onSendMessage, inputValue, onInputChange }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      onInputChange('');
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img src={otherUser.profilePicture || '/default-avatar.png'} alt={otherUser.name} className={styles.chatUserAvatar} />
        <span className={styles.chatUserName}>{otherUser.name}</span>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${message.sender === currentUser.id ? styles.sent : styles.received}`}
          >
            <div className={styles.messageContent}>
              <p>{message.content}</p>
              <span className={styles.messageTime}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className={styles.chatInputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type a message..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;