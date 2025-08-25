/**
 * Utility functions for user data processing
 */

/**
 * Extract user initials from various name formats
 * @param {Object} user - User object containing name information
 * @returns {string} - User initials (2 uppercase letters) or fallback
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';

  // Priority 1: Use initials if already computed (from backend virtual field)
  if (user.initials && typeof user.initials === 'string' && user.initials.length >= 1) {
    return user.initials.toUpperCase().substring(0, 2);
  }

  // Priority 2: Use firstName and lastName if available
  if (user.firstName && user.lastName) {
    const firstInitial = user.firstName.trim().charAt(0).toUpperCase();
    const lastInitial = user.lastName.trim().charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }

  // Priority 3: Extract from fullName if available
  if (user.fullName && typeof user.fullName === 'string') {
    const names = user.fullName.trim().split(/\s+/); // Split by any whitespace
    if (names.length >= 2) {
      // Use first and last name
      const firstInitial = names[0].charAt(0).toUpperCase();
      const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
      return firstInitial + lastInitial;
    } else if (names.length === 1 && names[0].length > 0) {
      // Single name - use first letter twice or first two letters
      const name = names[0];
      if (name.length >= 2) {
        return (name.charAt(0) + name.charAt(1)).toUpperCase();
      }
      return (name.charAt(0) + name.charAt(0)).toUpperCase();
    }
  }

  // Priority 4: Extract from email if available
  if (user.email && typeof user.email === 'string') {
    const emailUsername = user.email.split('@')[0];
    if (emailUsername.length >= 2) {
      return (emailUsername.charAt(0) + emailUsername.charAt(1)).toUpperCase();
    } else if (emailUsername.length === 1) {
      return (emailUsername.charAt(0) + emailUsername.charAt(0)).toUpperCase();
    }
  }

  // Fallback
  return 'U';
};

/**
 * Get user display name in order of preference
 * @param {Object} user - User object containing name information
 * @returns {string} - User display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'User';

  // Priority 1: firstName (more personal)
  if (user.firstName) {
    return user.firstName;
  }

  // Priority 2: fullName
  if (user.fullName) {
    // Extract first name from full name
    const names = user.fullName.trim().split(/\s+/);
    return names[0];
  }

  // Priority 3: email username
  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'User';
};

/**
 * Get user full display name for formal contexts
 * @param {Object} user - User object containing name information
 * @returns {string} - User full display name
 */
export const getUserFullDisplayName = (user) => {
  if (!user) return 'User';

  // Priority 1: fullName if available
  if (user.fullName) {
    return user.fullName;
  }

  // Priority 2: firstName + lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  // Priority 3: firstName only
  if (user.firstName) {
    return user.firstName;
  }

  // Priority 4: email username
  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'User';
};