import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaCalendar, FaUsers, FaBell, FaUser, FaChartBar, FaSignOutAlt, FaEnvelope, FaVideo } from 'react-icons/fa';
import '../../styles/mentor_dashboard/MentorDashboard.css';

const MentorDashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Stats', icon: <FaChartBar />, path: '/mentor/dashboard' },
    { name: 'Calendar', icon: <FaCalendar />, path: '/mentor/dashboard/calendar' },
    { name: 'Students', icon: <FaUsers />, path: '/mentor/dashboard/students' },
    { name: 'Notifications', icon: <FaBell />, path: '/mentor/dashboard/notifications' },
    { name: 'Profile', icon: <FaUser />, path: '/mentor/dashboard/userprofile' },
    { name: 'Messages', icon: <FaEnvelope />, path: '/mentor/dashboard/messages' },
    {name:'Classes', icon: <FaVideo/>,path:'/mentor/dashboard/classes'}
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mentor-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1>MentorConnect</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
          <button className="nav-item logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome, {user.name}</h2>
        </header>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MentorDashboardPage;