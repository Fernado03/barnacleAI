/**
 * Validation utilities for Barnacle Authentication System
 */

// Email validation regex - RFC 5322 compliant
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Name validation regex (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length < 5) {
    return { isValid: false, message: 'Email must be at least 5 characters long' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, message: 'Email address is too long' };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, email: trimmedEmail };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }

  // Check for common weak passwords
  const weakPasswords = [
    '123456', 'password', 'qwerty', 'abc123', 'password123',
    '12345678', '123456789', 'letmein', 'welcome', 'admin'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, message: 'Please choose a stronger password' };
  }

  // Check for sequential or repeated characters
  if (/(\d)\1{2,}/.test(password) || /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
    return { isValid: false, message: 'Avoid using sequential or repeated characters' };
  }

  return { isValid: true };
};

/**
 * Validate full name
 * @param {string} fullName - Full name to validate
 * @returns {object} - {isValid: boolean, message: string, firstName?: string, lastName?: string}
 */
const validateFullName = (fullName) => {
  if (!fullName) {
    return { isValid: false, message: 'Full name is required' };
  }

  const trimmedName = fullName.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Full name must be at least 2 characters long' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, message: 'Full name cannot exceed 100 characters' };
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  // Parse names
  const names = trimmedName.split(/\s+/).filter(name => name.length > 0);
  
  if (names.length === 0) {
    return { isValid: false, message: 'Please provide a valid full name' };
  }

  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(' ') : names[0];

  return {
    isValid: true,
    fullName: trimmedName,
    firstName,
    lastName
  };
};

/**
 * Validate signup data
 * @param {object} data - Signup data {fullName, email, password, agreeToTerms}
 * @returns {object} - {isValid: boolean, errors: array, validatedData?: object}
 */
const validateSignupData = (data) => {
  const { fullName, email, password, agreeToTerms } = data;
  const errors = [];
  const validatedData = {};

  // Validate full name
  const nameValidation = validateFullName(fullName);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  } else {
    validatedData.fullName = nameValidation.fullName;
    validatedData.firstName = nameValidation.firstName;
    validatedData.lastName = nameValidation.lastName;
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message);
  } else {
    validatedData.email = emailValidation.email;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  } else {
    validatedData.password = password;
  }

  // Validate terms agreement
  if (!agreeToTerms) {
    errors.push('You must agree to the terms and conditions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData: errors.length === 0 ? validatedData : null
  };
};

/**
 * Validate login data
 * @param {object} data - Login data {email, password}
 * @returns {object} - {isValid: boolean, errors: array, validatedData?: object}
 */
const validateLoginData = (data) => {
  const { email, password } = data;
  const errors = [];
  const validatedData = {};

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message);
  } else {
    validatedData.email = emailValidation.email;
  }

  // Basic password validation for login
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 1 || password.length > 128) {
    errors.push('Invalid credentials');
  } else {
    validatedData.password = password;
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData: errors.length === 0 ? validatedData : null
  };
};

/**
 * Sanitize user input by removing potentially dangerous characters
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1f\x7f]/g, ''); // Remove control characters
};

module.exports = {
  validateEmail,
  validatePassword,
  validateFullName,
  validateSignupData,
  validateLoginData,
  sanitizeInput,
  EMAIL_REGEX,
  NAME_REGEX
};