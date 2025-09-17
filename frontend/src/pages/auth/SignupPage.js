import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import '../../styles/auth.css';

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Join MentorConnect</h1>
        <SignupForm />
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;