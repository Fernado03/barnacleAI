import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserDisplayName, getUserInitials } from '../utils/userUtils';
import { useMaritimeToast } from '../hooks/useMaritimeToast';
import { DESIGN_TOKENS } from '../constants/designTokens';
import { FaUser, FaEdit, FaSave, FaTimes, FaAnchor, FaShip, FaClock, FaUserShield } from 'react-icons/fa';
import { Fish, Whale, Jellyfish, Seaweed, Coral, Starfish, Anchor, Lighthouse } from '../components/shared/MarineElement';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: getUserDisplayName(user) || '',
    email: user?.email || ''
  });
  
  const queryClient = useQueryClient();
  const toast = useMaritimeToast();

  // Check if user is admin (admins cannot edit their profile)
  const isAdmin = user?.role === 'Administrator';
  const canEditProfile = !isAdmin;

  const userName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => authAPI.updateProfile(profileData),
    onSuccess: (data) => {
      if (data?.success) {
        // Update the user data in the auth context
        queryClient.invalidateQueries(['auth', 'profile']);
        setIsEditing(false);
        toast.success('Profile Updated', 'Your profile has been updated successfully!');
      }
    },
    onError: (error) => {
      toast.error('Update Failed', error.message || 'Failed to update profile. Please try again.');
    }
  });

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!editedProfile.fullName.trim() || !editedProfile.email.trim()) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }

    updateProfileMutation.mutate({
      fullName: editedProfile.fullName.trim(),
      email: editedProfile.email.trim()
    });
  };

  const handleCancel = () => {
    setEditedProfile({
      fullName: getUserDisplayName(user) || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedProfile({
      fullName: getUserDisplayName(user) || '',
      email: user?.email || ''
    });
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${DESIGN_TOKENS.marine.backgrounds.light} ${DESIGN_TOKENS.layout.flex.center}`}>
        <div className="text-center ${DESIGN_TOKENS.marine.elements.container.narrow}">
          <div className="bg-white ${DESIGN_TOKENS.borders.radius.xl} ${DESIGN_TOKENS.shadows.xl} p-12">
            <FaUserShield className="mx-auto text-6xl text-blue-600 mb-6" />
            <h1 className="${DESIGN_TOKENS.typography.fontSize['3xl']} ${DESIGN_TOKENS.typography.fontWeight.bold} text-gray-800 mb-4">
              Access Denied
            </h1>
            <p className="${DESIGN_TOKENS.typography.fontSize.lg} text-gray-600">
              Please log in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${DESIGN_TOKENS.marine.backgrounds.light} ${DESIGN_TOKENS.layout.flex.center}`}>
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white ${DESIGN_TOKENS.borders.radius.xl} ${DESIGN_TOKENS.shadows.xl} px-8 py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="${DESIGN_TOKENS.typography.fontSize.lg} ${DESIGN_TOKENS.typography.fontWeight.medium} text-gray-700">
              Loading profile...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-cyan-600 relative overflow-hidden animate-gradient-x pt-28">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/20 animate-pulse"></div>
      
      {/* Enhanced marine background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-12 opacity-30 transform hover:scale-110 transition-transform duration-1000">
          <Whale size={250} animationSpeed={12} />
        </div>
        <div className="absolute bottom-20 right-16 opacity-25 transform rotate-12 hover:rotate-0 transition-transform duration-1000">
          <Fish size={180} animationSpeed={8} />
        </div>
        <div className="absolute top-1/3 right-8 opacity-20 animate-pulse">
          <Lighthouse size={200} />
        </div>
        <div className="absolute bottom-16 left-1/5 opacity-25 animate-bounce">
          <Anchor size={140} />
        </div>
        <div className="absolute top-1/4 left-6 opacity-20 animate-sway">
          <Seaweed height={180} animationSpeed={6} />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-30 animate-spin-slow">
          <Starfish size={110} />
        </div>
        <div className="absolute top-1/2 left-1/3 opacity-15">
          <Coral size={120} />
        </div>
        <div className="absolute bottom-1/3 left-1/2 opacity-20 animate-float">
          <Jellyfish size={100} animationSpeed={15} />
        </div>
      </div>

      {/* Enhanced floating particles with multiple layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1 - Large particles */}
        <div className="absolute top-1/6 left-1/6 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-1/4 right-1/6 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
        <div className="absolute bottom-1/6 left-1/4 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1.5s', animationDuration: '2s'}}></div>
        
        {/* Layer 2 - Medium particles */}
        <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute top-1/2 left-1/5 w-4 h-4 bg-gradient-to-r from-teal-300 to-green-300 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        {/* Layer 3 - Small particles */}
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-1/5 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute top-2/5 right-2/5 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
        <div className="absolute bottom-2/5 left-2/5 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-8 h-8 border-2 border-white/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/3 w-6 h-6 border-2 border-cyan-300/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/6 w-4 h-12 bg-gradient-to-b from-purple-400/30 to-transparent rotate-12 animate-sway"></div>
        <div className="absolute bottom-1/4 right-1/6 w-10 h-2 bg-gradient-to-r from-pink-400/30 to-transparent animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Enhanced header with spectacular animations */}
          <div className="text-center mb-20">
            <div className="relative inline-block mb-10">
              {/* Multiple glowing rings */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30 animate-ping scale-125"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-20 animate-pulse scale-110"></div>
              
              {/* Main icon with rainbow gradient */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500 animate-pulse">
                <FaUser className="text-4xl text-white drop-shadow-lg" />
              </div>
              
              {/* Orbiting elements */}
              <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 -right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 -left-2 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
            
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-6 animate-gradient-x drop-shadow-2xl">
              ⚓ Maritime Profile Hub ⚓
            </h1>
            <div className="relative">
              <p className="text-2xl font-semibold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent max-w-3xl mx-auto drop-shadow-lg">
                🌊 Chart your course through the digital seas 🌊
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Spectacular main profile card */}
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden mb-12 transform hover:scale-105 hover:rotate-1 transition-all duration-500 backdrop-blur-sm">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
            
            {/* Dynamic rainbow gradient header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-cyan-500 to-teal-500 relative overflow-hidden animate-gradient-x">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                
                {/* Enhanced floating elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-4 w-10 h-10 border-3 border-white/40 rounded-full animate-ping"></div>
                  <div className="absolute top-6 right-8 w-6 h-6 border-2 border-yellow-300/60 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-1/4 w-8 h-8 border-2 border-pink-300/50 rounded-full animate-bounce"></div>
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 right-1/3 w-12 h-2 bg-white/20 rounded-full animate-pulse"></div>
                  
                  {/* Shooting stars effect */}
                  <div className="absolute top-8 left-1/3 w-1 h-8 bg-gradient-to-b from-white to-transparent rotate-45 animate-pulse"></div>
                  <div className="absolute bottom-12 right-1/4 w-1 h-6 bg-gradient-to-b from-yellow-300 to-transparent rotate-12 animate-pulse"></div>
                </div>
              </div>
              
              {/* Spectacular profile avatar */}
              <div className="absolute -bottom-20 left-8">
                <div className="relative group">
                  {/* Multiple glow layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 scale-150 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 scale-125 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300 scale-110 animate-pulse"></div>
                  
                  {/* Main avatar container */}
                  <div className="relative w-40 h-40 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-full p-3 shadow-2xl border-4 border-white/80">
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-gradient-x shadow-inner">
                      {userInitials || <FaUser className="text-3xl" />}
                    </div>
                  </div>
                  
                  {/* Enhanced status indicator with animation */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Orbiting status indicators */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute -top-2 left-1/2 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 -right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 -left-2 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transform -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Spectacular admin badge */}
              {isAdmin && (
                <div className="absolute top-6 right-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse scale-110"></div>
                    <div className="relative bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-pulse transform hover:scale-105 transition-transform duration-300 border-2 border-white/30">
                      <FaUserShield className="text-lg animate-bounce" />
                      <span className="font-bold text-lg">🛡️ SYSTEM ADMIN 🛡️</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced content section */}
            <div className="relative pt-24 pb-12 px-10">
              {/* Enhanced action buttons */}
              <div className="flex justify-end mb-10">
                {isAdmin ? (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 max-w-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaAnchor className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="text-amber-900 font-bold text-lg mb-2">Administrator Shield</h4>
                        <p className="text-amber-800 text-sm leading-relaxed">
                          Your profile is secured with maximum protection. Enhanced security protocols are active.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : !isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="group relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden animate-gradient-x"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center space-x-4">
                      <FaEdit className="text-xl animate-pulse" />
                      <span className="font-bold text-xl">✨ Customize Profile ✨</span>
                    </div>
                    <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                    <div className="absolute bottom-2 left-3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden animate-gradient-x"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4">
                        {updateProfileMutation.isPending ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white"></div>
                        ) : (
                          <FaSave className="text-xl animate-pulse" />
                        )}
                        <span className="font-bold text-xl">
                          {updateProfileMutation.isPending ? '⚡ Updating...' : '💾 Save Changes'}
                        </span>
                      </div>
                      <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                      <div className="absolute bottom-2 left-3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                      className="group relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden animate-gradient-x"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4">
                        <FaTimes className="text-xl animate-pulse" />
                        <span className="font-bold text-xl">❌ Cancel</span>
                      </div>
                      <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                      <div className="absolute bottom-2 left-3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                    </button>
                  </div>
                )}
              </div>

              {/* Spectacular profile information */}
              <div className="space-y-12">
                {/* Personal details with rainbow gradient background */}
                <div className="relative bg-gradient-to-br from-purple-100 via-blue-50 via-cyan-50 to-pink-100 rounded-3xl p-10 border-2 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
                  {/* Section glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                                  
                  <h3 className="relative text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text mb-10 flex items-center space-x-4 animate-gradient-x">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <span>🌟 Personal Information 🌟</span>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce"></div>
                  </h3>
                  
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Spectacular Full Name */}
                      <div className="group relative">
                        <label className="block text-lg font-bold text-transparent bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text mb-4 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                          <span>✨ Full Name</span>
                        </label>
                        {isEditing && canEditProfile ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
                            <input
                              type="text"
                              value={editedProfile.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="relative w-full px-8 py-5 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-500 text-xl bg-gradient-to-br from-white to-purple-50 shadow-lg hover:shadow-xl font-semibold"
                              placeholder="Enter your magnificent name ✨"
                            />
                            <div className="absolute top-2 right-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="relative px-8 py-5 bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl border-3 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:border-purple-400 transform hover:-translate-y-1">
                            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text">{userName}</p>
                            <div className="absolute top-2 right-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}
                      </div>

                      {/* Spectacular Email */}
                      <div className="group relative">
                        <label className="block text-lg font-bold text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text mb-4 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                          <span>📧 Email Address</span>
                        </label>
                        {isEditing && canEditProfile ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
                            <input
                              type="email"
                              value={editedProfile.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="relative w-full px-8 py-5 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-500 text-xl bg-gradient-to-br from-white to-cyan-50 shadow-lg hover:shadow-xl font-semibold"
                              placeholder="Enter your email address 📧"
                            />
                            <div className="absolute top-2 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="relative px-8 py-5 bg-gradient-to-br from-white via-cyan-50 to-blue-50 rounded-2xl border-3 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:border-cyan-400 transform hover:-translate-y-1">
                            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text">{user?.email}</p>
                            <div className="absolute top-2 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spectacular account details section */}
                  <div className="relative bg-gradient-to-br from-pink-100 via-purple-50 via-blue-50 to-cyan-100 rounded-3xl p-10 border-2 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
                    {/* Section glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                    
                    <h3 className="relative text-3xl font-black text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text mb-10 flex items-center space-x-4 animate-gradient-x">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                        <FaShip className="text-white text-xl" />
                      </div>
                      <span>⚓ Account Details ⚓</span>
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full animate-bounce"></div>
                    </h3>
                    
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Enhanced Role */}
                      <div className="group relative">
                        <label className="block text-lg font-bold text-transparent bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text mb-4 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                          <span>🎯 Your Role</span>
                        </label>
                        <div className="relative px-8 py-5 bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-2xl border-3 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:border-pink-400 transform hover:-translate-y-1">
                          <p className="text-xl font-bold text-transparent bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text">{user?.role}</p>
                          <div className="absolute top-2 right-3 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Enhanced Join Date */}
                      <div className="group relative">
                        <label className="block text-lg font-bold text-transparent bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text mb-4 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
                          <span>🗓️ Join Date</span>
                        </label>
                        <div className="relative px-8 py-5 bg-gradient-to-br from-white via-purple-50 to-cyan-50 rounded-2xl border-3 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:border-purple-400 transform hover:-translate-y-1">
                          <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                          <div className="absolute top-2 right-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Enhanced Last Login */}
                      <div className="group relative lg:col-span-2">
                        <label className="block text-lg font-bold text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text mb-4 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                          <span>⏰ Last Login</span>
                        </label>
                        <div className="relative px-8 py-5 bg-gradient-to-br from-white via-cyan-50 to-blue-50 rounded-2xl border-3 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:border-cyan-400 transform hover:-translate-y-1">
                          <p className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text">
                            {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </p>
                          <div className="absolute top-2 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;