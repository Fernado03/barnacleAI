import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaApple } from 'react-icons/fa';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { InlineLoading } from '../shared/Loading';
import { useAuth } from '../../contexts/AuthContext';

const SignUpForm = ({ onToggleMode, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Demo User',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Get loading state from AuthContext
  const { isSigningUp } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('SignUpForm handleSubmit called');
    console.log('Form data:', formData);
    console.log('isSigningUp:', isSigningUp);
    
    // Basic form validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      return; // Form validation will show via HTML5 required and browser validation
    }
    
    if (!formData.email.trim()) {
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      return;
    }
    
    if (!formData.role) {
      return;
    }
    
    if (!formData.agreeToTerms) {
      return;
    }
    
    if (onSubmit && !isSigningUp) {
      try {
        console.log('Calling onSubmit function...');
        await onSubmit(formData);
        console.log('onSubmit completed successfully');
      } catch (error) {
        console.error('SignUpForm onSubmit failed:', error);
        // Error is handled by AuthContext
      }
    } else {
      console.log('Signup already in progress or no onSubmit function, skipping...');
    }
  };

  const handleSocialLogin = (provider) => {
    // Social authentication integration would be implemented here
    console.log(`${provider} authentication requested`);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-500' };
    if (password.length < 10) return { strength: 2, text: 'Fair', color: 'text-yellow-500' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Strong', color: 'text-green-500' };
    }
    return { strength: 2, text: 'Good', color: 'text-blue-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Full Name
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300 ${
              focusedField === 'fullName' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <HiUser className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm
                         placeholder:text-gray-400 text-gray-700 font-medium
                         ${focusedField === 'fullName' 
                           ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                           : 'border-gray-200 hover:border-gray-300'
                         }
                         focus:outline-none focus:ring-0`}
              placeholder="👤 Enter your full name"
              minLength={2}
              maxLength={100}
              required
            />
          </div>
        </div>

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
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm
                         placeholder:text-gray-400 text-gray-700 font-medium
                         ${focusedField === 'email' 
                           ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                           : 'border-gray-200 hover:border-gray-300'
                         }
                         focus:outline-none focus:ring-0`}
              placeholder="📧 Enter your email"
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
              autoComplete="new-password"
              data-lpignore="true"
              data-form-type="password"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm
                         placeholder:text-gray-400 text-gray-700 font-medium
                         ${focusedField === 'password' 
                           ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                           : 'border-gray-200 hover:border-gray-300'
                         }
                         focus:outline-none focus:ring-0
                         [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
              placeholder="🔒 Create password"
              minLength={6}
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
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.strength
                        ? passwordStrength.strength === 1
                          ? 'bg-red-500'
                          : passwordStrength.strength === 2
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${passwordStrength.color}`}>
                {passwordStrength.text}
              </span>
            </div>
          )}
        </div>

        {/* Role Selection Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Select Your Role
          </label>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300 ${
              focusedField === 'role' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <HiUser className="h-5 w-5" />
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('role')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm
                         text-gray-700 font-medium
                         ${
                           focusedField === 'role'
                             ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80'
                             : 'border-gray-200 hover:border-gray-300'
                         }
                         focus:outline-none focus:ring-0`}
              required
            >
              <option value="Demo User">Demo User</option>
              <option value="Ship Captain">Ship Captain</option>
              <option value="Fleet Operator">Fleet Operator</option>
            </select>
          </div>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p className="font-medium text-gray-700">Choose your role:</p>
            <div className="pl-2 space-y-1">
              <p>• <span className="font-medium text-blue-600">Demo User:</span> Explore features with sample data</p>
              <p>• <span className="font-medium text-teal-600">Ship Captain:</span> Manage individual vessel operations</p>
              <p>• <span className="font-medium text-indigo-600">Fleet Operator:</span> Oversee multiple vessel fleets</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
              <p className="text-amber-700 font-medium text-xs">
                🔒 Administrator access requires invitation from existing admins
              </p>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start">
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="sr-only"
              required
            />
            <div className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-all duration-200 mt-0.5 ${
              formData.agreeToTerms 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 group-hover:border-gray-400'
            }`}>
              {formData.agreeToTerms && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                Privacy Policy
              </button>
            </span>
          </label>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={!formData.fullName || !formData.email || !formData.password || !formData.role || !formData.agreeToTerms || isSigningUp}
          className={`w-full font-semibold py-3 px-6 rounded-xl transform transition-all duration-300 
                     shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20
                     ${formData.fullName && formData.email && formData.password && formData.role && formData.agreeToTerms && !isSigningUp
                       ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
        >
          {isSigningUp ? (
            <div className="flex items-center justify-center">
              <InlineLoading text="Creating account..." ariaLabel="Creating account" />
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 text-gray-500 font-medium">Or sign up with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center
                     hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
        >
          <FaGoogle className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center
                     hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
        >
          <FaGithub className="h-4 w-4 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('Apple')}
          className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center
                     hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
        >
          <FaApple className="h-4 w-4 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-2">
        <p className="text-gray-600 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 underline decoration-blue-500/30 hover:decoration-blue-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;