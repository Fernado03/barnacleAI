import React, { useEffect } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectIsAuthenticated, clearErrors } from '../redux/Slices/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/statistics'); // or wherever you want to redirect authenticated users
    }
  }, [isAuthenticated, navigate]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const handleToggleMode = () => {
    navigate('/signup');
  };

  const handleLogin = async (formData) => {
    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is automatically stored in Redux state and will be displayed by LoginForm
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
    >
      <LoginForm 
        onToggleMode={handleToggleMode}
        onSubmit={handleLogin}
      />
    </AuthLayout>
  );
};

export default Login;