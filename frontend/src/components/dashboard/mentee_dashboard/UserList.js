import React from 'react';
import styles from '../../../styles/mentee_dashboard/Messages.module.css';

const UserList = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className={styles.userList}>
      <h2 className={styles.userListTitle}>Connected Mentors</h2>
      <div className={styles.userListScroll}>
        {users.map((user) => (
          <div
            key={user._id}
            className={`${styles.userItem} ${selectedUser && selectedUser._id === user._id ? styles.selected : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <img src={user.profilePicture || '/default-avatar.png'} alt={user.name} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;