import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpForm from '../components/auth/SignUpForm';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleToggleMode = () => {
    navigate('/login');
  };

  const handleSignUp = async (formData) => {
    console.log('SignUp page handleSignUp called:', formData);
    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        agreeToTerms: formData.agreeToTerms
      });
      console.log('Signup successful, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Signup failed in SignUp page:', error);
      throw error; // Re-throw to let SignUpForm handle the error state
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the marine community"
    >
      <SignUpForm 
        onToggleMode={handleToggleMode}
        onSubmit={handleSignUp}
      />
    </AuthLayout>
  );
};

export default SignUp;