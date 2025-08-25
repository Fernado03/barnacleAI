import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { useMaritimeNotifications } from '../hooks/useMaritimeNotifications';

// Authentication context
const AuthContext = createContext(null);

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();
  
  // Ref to track if login success has been handled
  const loginSuccessHandledRef = useRef(false);
  
  // Ref to track if token was cleared due to auth error
  const tokenClearedRef = useRef(false);
  
  // Ref to track if logout has been handled
  const logoutHandledRef = useRef(false);

  // Get token from localStorage or sessionStorage (memoized)
  const getToken = useCallback(() => {
    // Check localStorage first (remember me), then sessionStorage
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }, []);
  
  // Set token with remember me option (memoized)
  const setToken = useCallback((token, rememberMe = false) => {
    if (token) {
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        // Remove from sessionStorage if exists
        sessionStorage.removeItem('authToken');
      } else {
        sessionStorage.setItem('authToken', token);
        // Remove from localStorage if exists
        localStorage.removeItem('authToken');
      }
    } else {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  }, []);

  // Check if user has remember me enabled (memoized)
  const hasRememberMe = useCallback(() => {
    return !!localStorage.getItem('authToken');
  }, []);

  // Query for user profile verification
  const {
    isLoading: isVerifying,
    error: verifyError,
    data: profileData,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authAPI.getProfile,
    enabled: !!getToken() && !tokenClearedRef.current,
    retry: (failureCount, error) => {
      // Don't retry on auth errors (401, 403)
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (was cacheTime in v4)
  });

  // Handle profile data changes
  useEffect(() => {
    if (profileData?.success && profileData?.data?.user) {
      setUser(profileData.data.user);
      setIsInitialized(true);
      // Reset token cleared flag when we successfully get user data
      tokenClearedRef.current = false;
    } else if (verifyError && (verifyError?.status === 401 || verifyError?.status === 403) && !tokenClearedRef.current) {
      // If token is invalid and we haven't already cleared it, remove it
      console.log('Invalid token detected, clearing authentication state');
      tokenClearedRef.current = true;
      setToken(null);
      setUser(null);
      setIsInitialized(true);
      
      // Clear all cached data to prevent stale queries
      queryClient.clear();
      
      // Show notification about session expiry
      notifications.user.actionFailed(
        'Session Expired',
        'Your session has expired or user account was deleted. Please log in again.'
      );
    } else if (verifyError && !tokenClearedRef.current) {
      // Other errors, still initialize but don't clear user data
      console.log('Profile verification error (non-auth):', verifyError);
      setIsInitialized(true);
    } else if (!getToken()) {
      // No token, initialize immediately
      setIsInitialized(true);
      tokenClearedRef.current = false;
    }
  }, [profileData, verifyError?.status, verifyError?.message, verifyError, getToken, notifications.user, queryClient, setToken]);

  // Initialize authentication state on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    console.log('AuthContext: Initializing with token:', !!token);
    
    if (!token) {
      // No token found, user is not authenticated
      setIsInitialized(true);
      tokenClearedRef.current = false;
      console.log('AuthContext: No token found, marking as initialized');
    } else {
      // Reset token cleared flag when we have a token
      tokenClearedRef.current = false;
    }
    // If token exists, the useQuery will handle verification automatically
  }, []); // Empty dependency array to run only once

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log('Login mutation started:', credentials);
      const result = await authAPI.login(credentials);
      console.log('Login mutation result:', result);
      return { ...result, rememberMe: credentials.rememberMe };
    }
  });

  // Handle login success
  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data && !loginSuccessHandledRef.current) {
      const data = loginMutation.data;
      console.log('Login mutation onSuccess:', data);
      if (data?.success && data?.data?.user) {
        // Mark as handled to prevent duplicate execution
        loginSuccessHandledRef.current = true;
        
        // Set token and user first
        setToken(data.data.token, data.rememberMe);
        setUser(data.data.user);
        
        // Small delay to ensure token is set before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 50);
        
        notifications.user.loginSuccess(
          data.data.user.firstName || data.data.user.fullName || 'User'
        );
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, setToken, queryClient, notifications.user]);
  
  // Reset login success flag when mutation resets
  useEffect(() => {
    if (!loginMutation.isSuccess && !loginMutation.isPending) {
      loginSuccessHandledRef.current = false;
    }
  }, [loginMutation.isSuccess, loginMutation.isPending]);

  // Handle login error
  useEffect(() => {
    if (loginMutation.isError && loginMutation.error) {
      console.error('Login mutation onError:', loginMutation.error);
      notifications.user.actionFailed(
        'Login',
        loginMutation.error.message || 'Invalid credentials'
      );
    }
  }, [loginMutation.isError, loginMutation.error, notifications.user]);

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (userData) => {
      console.log('Signup mutation started:', userData);
      const result = await authAPI.signup(userData);
      console.log('Signup mutation result:', result);
      return result;
    }
  });

  // Handle signup success
  useEffect(() => {
    if (signupMutation.isSuccess && signupMutation.data) {
      const data = signupMutation.data;
      console.log('Signup mutation onSuccess:', data);
      if (data?.success && data?.data?.user) {
        setToken(data.data.token, false); // Default to session storage for signup
        setUser(data.data.user);
        
        // Small delay to ensure token is set before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 50);
        
        notifications.user.actionCompleted(
          `Welcome to Barnacle-AI, ${data.data.user.firstName || data.data.user.fullName || 'User'}!`
        );
      }
    }
  }, [signupMutation.isSuccess, signupMutation.data, setToken, queryClient, notifications.user]);

  // Handle signup error
  useEffect(() => {
    if (signupMutation.isError && signupMutation.error) {
      console.error('Signup mutation onError:', signupMutation.error);
      notifications.user.actionFailed(
        'Account Creation',
        signupMutation.error.message || 'Failed to create account'
      );
    }
  }, [signupMutation.isError, signupMutation.error, notifications.user]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout
  });

  // Handle logout success
  useEffect(() => {
    if (logoutMutation.isSuccess && !logoutHandledRef.current) {
      logoutHandledRef.current = true;
      
      // Clear tokens first
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      
      setToken(null);
      setUser(null);
      
      // Clear all cached data
      queryClient.clear();
      
      // Use setTimeout to prevent potential re-render loops
      setTimeout(() => {
        notifications.user.logoutSuccess();
      }, 0);
    }
  }, [logoutMutation.isSuccess, notifications.user, queryClient, setToken]);

  // Reset logout success flag when mutation resets
  useEffect(() => {
    if (!logoutMutation.isSuccess && !logoutMutation.isPending) {
      logoutHandledRef.current = false;
    }
  }, [logoutMutation.isSuccess, logoutMutation.isPending]);

  // Handle logout error
  useEffect(() => {
    if (logoutMutation.isError) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      
      setToken(null);
      setUser(null);
      queryClient.clear();
      
      console.error('Logout error:', logoutMutation.error);
      
      // Use setTimeout to prevent potential re-render loops
      setTimeout(() => {
        notifications.user.logoutSuccess();
      }, 0);
    }
  }, [logoutMutation.isError, logoutMutation.error, notifications.user, queryClient, setToken]);

  // Authentication methods
  const login = useCallback(async (credentials) => {
    return loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const signup = useCallback(async (userData) => {
    return signupMutation.mutateAsync(userData);
  }, [signupMutation]);

  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);



  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user?.role]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user?.role]);

  // Refresh authentication state
  const refresh = useCallback(() => {
    if (getToken()) {
      refetchProfile();
    }
  }, [refetchProfile, getToken]);

  // Check if user is authenticated (memoized)
  const isAuthenticatedMemo = useMemo(() => {
    return !!user && !!getToken();
  }, [user, getToken]);

  // Auth context value (memoized to prevent unnecessary re-renders)
  const value = useMemo(() => ({
    // State
    user,
    isAuthenticated: isAuthenticatedMemo,
    isInitialized,
    isLoading: isVerifying || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    error: verifyError || loginMutation.error || signupMutation.error || logoutMutation.error,
    
    // Methods
    login,
    signup,
    logout,
    refresh,
    hasRole,
    hasAnyRole,
    
    // Token management
    getToken,
    hasRememberMe,
    
    // Mutation states for fine-grained control
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }), [
    user,
    isAuthenticatedMemo,
    isInitialized,
    isVerifying,
    loginMutation.isPending,
    loginMutation.error,
    signupMutation.isPending,
    signupMutation.error,
    logoutMutation.isPending,
    logoutMutation.error,
    verifyError,
    login,
    signup,
    logout,
    refresh,
    hasRole,
    hasAnyRole,
    getToken,
    hasRememberMe
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};