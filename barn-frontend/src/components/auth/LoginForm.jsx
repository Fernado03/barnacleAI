import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaApple, FaExclamationTriangle } from 'react-icons/fa';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { InlineLoading } from '../shared/Loading';
import { useAuth } from '../../contexts/AuthContext';
import { useMaritimeNotifications } from '../../hooks/useMaritimeNotifications';

const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Authentication context
  const { login, isLoggingIn, error } = useAuth();
  
  // Maritime notifications
  const notifications = useMaritimeNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('LoginForm handleSubmit called');
    console.log('Form data:', formData);
    console.log('isLoggingIn:', isLoggingIn);
    
    if (!isLoggingIn) {
      try {
        console.log('Calling login function...');
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        });
        console.log('Login function completed successfully');
        // Success notification is handled in AuthContext
      } catch (error) {
        console.error('Login function failed:', error);
        // Error notification is handled in AuthContext
      }
    } else {
      console.log('Login already in progress, skipping...');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialLogin = (provider) => {
    notifications.system.dataProcessing(`${provider} authentication`, 'starting');
    // Social authentication integration would be implemented here
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {error.message || 'Login failed'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Email Address
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300 ${
              focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <HiMail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 bg-gray-50
                         placeholder:text-gray-400 text-gray-700 font-medium
                         ${focusedField === 'email' 
                           ? 'border-blue-500 shadow-md bg-white' 
                           : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                         }
                         focus:outline-none focus:ring-0`}
              placeholder="📧 Enter your email address"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Password
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300 ${
              focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <HiLockClosed className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              autoComplete="current-password"
              data-lpignore="true"
              data-form-type="password"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 bg-gray-50
                         placeholder:text-gray-400 text-gray-700 font-medium
                         ${focusedField === 'password' 
                           ? 'border-blue-500 shadow-md bg-white' 
                           : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                         }
                         focus:outline-none focus:ring-0
                         [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
              placeholder="🔒 ••••••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-all duration-200 ${
              formData.rememberMe 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 group-hover:border-gray-400'
            }`}>
              {formData.rememberMe && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoggingIn}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl 
                     transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20
                     ${isLoggingIn 
                       ? 'opacity-70 cursor-not-allowed' 
                       : 'hover:from-blue-700 hover:to-indigo-700'
                     }`}
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center">
              <InlineLoading text="Signing in..." ariaLabel="Logging in" />
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Social Login Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:border-gray-300 
                     transition-all duration-300 hover:shadow-md bg-white group"
        >
          <FaGoogle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:border-gray-300 
                     transition-all duration-300 hover:shadow-md bg-white group"
        >
          <FaGithub className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('Apple')}
          className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:border-gray-300 
                     transition-all duration-300 hover:shadow-md bg-white group"
        >
          <FaApple className="h-5 w-5 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">or</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-4">
        <p className="text-gray-600 font-medium">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 underline decoration-blue-500/30 hover:decoration-blue-500"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;