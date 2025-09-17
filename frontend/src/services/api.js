import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signupUser = async (name, username, email, password, role) => {
  const response = await api.post('/auth/signup', { name, username, email, password, role });
  return response.data;
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const createMentorProfile = async (profileData) => {
  const response = await api.post('/mentor/profile', profileData);
  return response.data;
};

export const getMentorProfile = async () => {
  const response = await api.get('/mentor/profile');
  return response.data;
};

export const updateMentorProfile = async (profileData) => {
  const response = await api.put('/mentor/profile', profileData);
  return response.data;
};

export const createMenteeProfile = async (profileData) => {
  const response = await api.post('/mentee/profile', profileData);
  return response.data;
};

export const getMenteeProfile = async () => {
  const response = await api.get('/mentee/profile');
  return response.data;
};

export const updateMenteeProfile = async (profileData) => {
  const response = await api.put('/mentee/profile', profileData);
  return response.data;
};

export const getMatchingMentors = async () => {
  const response = await api.get('/match/mentors');
  return response.data;
};

export const sendConnectionRequest = async (mentorId) => {
  try {
    const response = await api.post(`/notifications/request/${mentorId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;
  }
};

export const getNotificationsOfMentor = async () => {
  const response = await api.get('/notifications/mentor');
  return response.data;
};

export const updateNotificationStatus = async (notificationId, action) => {
  const response = await api.put(`/notifications/${notificationId}`, { action });
  return response.data;
};

export const getConnectedStudents = async () => {
  const response = await api.get('/connected-students');
  return response.data;
};

export const getMenteeNotifications = async () => {
  const response = await api.get('/mentee-notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/mentee-notifications/${notificationId}/read`);
  return response.data;
};

export const getConnectedMentors = async () => {
  const response = await api.get('/connected-mentors');
  return response.data;
};

export const getConnectedMentorsAndClasses = async () => {
  try {
    const response = await api.get('/mentee/mentors-and-classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching connected mentors and classes:', error);
    throw error;
  }
};

export const scheduleClass = async (classData) => {
  const response = await api.post('/upcoming-classes/schedule', classData);
  return response.data;
};

export const getUpcomingClasses = async () => {
  const response = await api.get('/upcoming-classes');
  return response.data;
};

export const deleteClass = async (classId) => {
  const response = await api.delete(`/upcoming-classes/${classId}`);
  return response.data;
};

// Updated chat-related functions
export const getMessages = async (userId, otherUserId) => {
  try {
    const response = await api.get(`/chat/${userId}/${otherUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred while fetching messages');
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/chat/send', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred while sending the message');
  }
};

export const createMenteeNotification = async (menteeId, message) => {
  try {
    const response = await api.post('/mentee-notifications', {
      mentee: menteeId,
      message: message,
      activeNotification: true
    });
    return response.data;
  } catch (error) {
    console.error('Error creating mentee notification:', error);
    throw error;
  }
};

export default api;