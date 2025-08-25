import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock user database for testing
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@barnacle.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Administrator',
    avatar: null
  },
  {
    id: 2,
    email: 'captain@barnacle.com',
    password: 'captain123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'Ship Captain',
    avatar: null
  },
  {
    id: 3,
    email: 'operator@barnacle.com',
    password: 'operator123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'Fleet Operator',
    avatar: null
  },
  {
    id: 4,
    email: 'demo@barnacle.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'Demo User',
    avatar: null
  }
];

// Mock authentication helper
const mockAuthenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        resolve({
          user: userWithoutPassword,
          token: `mock_token_${user.id}_${Date.now()}`,
          refreshToken: `mock_refresh_${user.id}_${Date.now()}`
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000); // 1 second delay to simulate real API
  });
};

// Mock signup helper
const mockSignup = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        reject(new Error('User with this email already exists'));
        return;
      }

      // Parse fullName into firstName and lastName
      let firstName = userData.firstName;
      let lastName = userData.lastName;
      
      if (userData.fullName && (!firstName || !lastName)) {
        const names = userData.fullName.trim().split(' ');
        firstName = names[0];
        lastName = names.length > 1 ? names.slice(1).join(' ') : names[0];
      }

      // Restrict Administrator role for security
      const allowedSelfSelectRoles = ['Ship Captain', 'Fleet Operator', 'Demo User'];
      const userRole = userData.role && allowedSelfSelectRoles.includes(userData.role) ? userData.role : 'Demo User';
      
      if (userData.role === 'Administrator') {
        console.warn('Security: Attempted self-assignment of Administrator role blocked');
      }

      // Create new user
      const newUser = {
        id: MOCK_USERS.length + 1,
        email: userData.email,
        fullName: userData.fullName || `${firstName || ''} ${lastName || ''}`.trim(),
        firstName,
        lastName,
        role: userRole, // Use restricted role
        avatar: null
      };

      // Add to mock database
      MOCK_USERS.push({ ...newUser, password: userData.password });

      resolve({
        user: newUser,
        token: `mock_token_${newUser.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${newUser.id}_${Date.now()}`
      });
    }, 1000);
  });
};

// Environment flag to use mock or real API
const USE_MOCK_API = true; // Set to false when you have a real backend

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        // Use mock authentication
        const data = await mockAuthenticate(email, password);
        
        // Store token based on rememberMe preference
        if (rememberMe) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        } else {
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('refreshToken', data.refreshToken);
        }

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          rememberMe
        };
      } else {
        // Real API call (uncomment when you have a backend)
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'Login failed');
        }

        const data = await response.json();
        
        // Store token based on rememberMe preference
        if (rememberMe) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        } else {
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('refreshToken', data.refreshToken);
        }

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          rememberMe
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async ({ email, password, fullName, role }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        // Use mock signup
        const data = await mockSignup({ email, password, fullName, role });
        
        // Store tokens in session storage for new signups
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('refreshToken', data.refreshToken);

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          rememberMe: false
        };
      } else {
        // Real API call (uncomment when you have a backend)
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, fullName, role }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'Signup failed');
        }

        const data = await response.json();
        
        // Store tokens in session storage for new signups
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('refreshToken', data.refreshToken);

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          rememberMe: false
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  'user/refreshAuthToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const refreshToken = user.refreshToken;

      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      if (USE_MOCK_API) {
        // Mock token refresh
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (refreshToken.startsWith('mock_refresh_')) {
              const userId = refreshToken.split('_')[2];
              resolve({
                token: `mock_token_${userId}_${Date.now()}`,
                refreshToken: `mock_refresh_${userId}_${Date.now()}`,
              });
            } else {
              reject(new Error('Invalid refresh token'));
            }
          }, 500);
        }).then(data => {
          // Update stored tokens
          const storage = user.rememberMe ? localStorage : sessionStorage;
          storage.setItem('authToken', data.token);
          storage.setItem('refreshToken', data.refreshToken);
          return data;
        }).catch(error => {
          throw new Error(error.message);
        });
      } else {
        // Real API call
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          return rejectWithValue('Token refresh failed');
        }

        const data = await response.json();
        
        // Update stored tokens
        const storage = user.rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.token);
        if (data.refreshToken) {
          storage.setItem('refreshToken', data.refreshToken);
        }

        return {
          token: data.token,
          refreshToken: data.refreshToken || refreshToken,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { getState }) => {
    try {
      const { user } = getState();
      
      if (USE_MOCK_API) {
        // Mock logout - just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Call logout API if user is authenticated
        if (user.token) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: user.refreshToken }),
          });
        }
      }

      // Clear stored tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');

      return null;
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      return null;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      
      if (USE_MOCK_API) {
        // Mock profile update
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (user.token && user.token.startsWith('mock_token_')) {
              // Update the user data
              const updatedUser = {
                ...user.user,
                ...profileData
              };
              resolve(updatedUser);
            } else {
              reject(new Error('Unauthorized - invalid token'));
            }
          }, 1000);
        });
      } else {
        // Real API call
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'Profile update failed');
        }

        const data = await response.json();
        return data.user;
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Helper function to get stored token
const getStoredToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to get stored refresh token
const getStoredRefreshToken = () => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

// Helper function to check if user data is stored in localStorage (rememberMe)
const isRemembered = () => {
  return !!localStorage.getItem('authToken');
};

const initialState = {
  // User data
  user: null,
  
  // Authentication tokens
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  
  // Authentication state
  isAuthenticated: !!getStoredToken(),
  rememberMe: isRemembered(),
  
  // Loading states
  isLoading: false,
  isRefreshing: false,
  
  // Error handling
  error: null,
  loginError: null,
  signupError: null,
  profileError: null,
  
  // Session management
  lastActivity: Date.now(),
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // User preferences
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.loginError = null;
      state.signupError = null;
      state.profileError = null;
    },
    
    // Clear specific error
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state[errorType] !== undefined) {
        state[errorType] = null;
      }
    },
    
    // Update last activity timestamp
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    
    // Update user preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    // Update notification preferences
    updateNotificationPreferences: (state, action) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
    },
    
    // Set session timeout
    setSessionTimeout: (state, action) => {
      state.sessionTimeout = action.payload;
    },
    
    // Reset user state (for cleanup)
    resetUserState: () => initialState,
    
    // Restore session from stored tokens
    restoreSession: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.rememberMe = isRemembered();
      state.lastActivity = Date.now();
    },
    
    // Check session validity
    checkSessionValidity: (state) => {
      const now = Date.now();
      const timeSinceLastActivity = now - state.lastActivity;
      
      if (timeSinceLastActivity > state.sessionTimeout && !state.rememberMe) {
        // Session expired for non-remembered users
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = 'Session expired. Please log in again.';
        
        // Clear session storage
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('refreshToken');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
        state.lastActivity = Date.now();
        state.loginError = null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Signup User
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.signupError = null;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
        state.lastActivity = Date.now();
        state.signupError = null;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.signupError = action.payload;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Refresh Token
      .addCase(refreshAuthToken.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.lastActivity = Date.now();
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        
        // Clear all stored tokens on refresh failure
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('refreshToken');
      })
      
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.rememberMe = false;
        state.error = null;
        state.loginError = null;
        state.signupError = null;
        state.profileError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the local state
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.rememberMe = false;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.profileError = null;
        state.lastActivity = Date.now();
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.profileError = action.payload;
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearError,
  updateLastActivity,
  updatePreferences,
  updateNotificationPreferences,
  setSessionTimeout,
  resetUserState,
  restoreSession,
  checkSessionValidity,
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectIsRefreshing = (state) => state.user.isRefreshing;
export const selectToken = (state) => state.user.token;
export const selectRefreshToken = (state) => state.user.refreshToken;
export const selectError = (state) => state.user.error;
export const selectLoginError = (state) => state.user.loginError;
export const selectSignupError = (state) => state.user.signupError;
export const selectProfileError = (state) => state.user.profileError;
export const selectRememberMe = (state) => state.user.rememberMe;
export const selectLastActivity = (state) => state.user.lastActivity;
export const selectSessionTimeout = (state) => state.user.sessionTimeout;
export const selectPreferences = (state) => state.user.preferences;
export const selectNotificationPreferences = (state) => state.user.preferences.notifications;

// Complex selectors
export const selectIsSessionValid = (state) => {
  const { lastActivity, sessionTimeout, rememberMe } = state.user;
  if (rememberMe) return true;
  const timeSinceLastActivity = Date.now() - lastActivity;
  return timeSinceLastActivity <= sessionTimeout;
};

export const selectUserRole = (state) => state.user.user?.role;
export const selectUserName = (state) => {
  const user = state.user.user;
  if (!user) return null;
  return user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email?.split('@')[0] || 'User';
};

export const selectUserInitials = (state) => {
  const user = state.user.user;
  if (!user) return '';
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return 'U';
};

// Export the reducer
export default userSlice.reducer;