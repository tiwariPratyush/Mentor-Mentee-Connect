import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CommonHomePage from './pages/common/CommonHomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import MentorDashboardPage from './pages/mentor/MentorDashboardPage';
import MenteeDashboardPage from './pages/mentee/MenteeDashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Mentor components
import MentorStats from './components/dashboard/mentor_dashboard/TeachersStats';
import MentorCalendar from './components/dashboard/mentor_dashboard/Calendar';
import Students from './components/dashboard/mentor_dashboard/Students';
import MentorNotifications from './components/dashboard/mentor_dashboard/Notifications';
import MentorUserProfile from './components/dashboard/mentor_dashboard/UserProfile';
import MentorMessages from './components/dashboard/mentor_dashboard/Messages';
import MentorClasses from './components/dashboard/mentor_dashboard/MentorClasses';

// Mentee components
import MenteeStats from './components/dashboard/mentee_dashboard/MenteeStats';
import MenteeCalendar from './components/dashboard/mentee_dashboard/Calendar';
import Teachers from './components/dashboard/mentee_dashboard/Teachers';
import MenteeNotifications from './components/dashboard/mentee_dashboard/Notifications';
import MenteeUserProfile from './components/dashboard/mentee_dashboard/UserProfile';
import MenteeMessages from './components/dashboard/mentee_dashboard/Messages';
import MenteeClasses from './components/dashboard/mentee_dashboard/MenteeClasses';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommonHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/mentor/dashboard"
        element={
          <ProtectedRoute allowedRole="mentor">
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<MentorStats />} />
        <Route path="calendar" element={<MentorCalendar />} />
        <Route path="students" element={<Students />} />
        <Route path="notifications" element={<MentorNotifications />} />
        <Route path="userprofile" element={<MentorUserProfile />} />
        <Route path="messages" element={<MentorMessages />} />
        <Route path="classes" element={<MentorClasses />} />
      </Route>
      <Route 
        path="/mentee/dashboard"
        element={
          <ProtectedRoute allowedRole="mentee">
            <MenteeDashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<MenteeStats />} />
        <Route path="calendar" element={<MenteeCalendar />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="notifications" element={<MenteeNotifications />} />
        <Route path="userprofile" element={<MenteeUserProfile />} />
        <Route path="messages" element={<MenteeMessages />} />
        <Route path="classes" element={<MenteeClasses />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;