import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMaritimeToast } from './useMaritimeToast';
import { addAlert } from '../redux/Slices/alertsSlice';

/**
 * Custom hook for maritime notifications using the new custom toast system
 * Provides maritime-specific notification patterns with enhanced styling
 */
export const useCustomMaritimeNotifications = () => {
  const dispatch = useDispatch();
  const { addToast, removeToast, removeAllToasts } = useMaritimeToast();
  const alertSettings = useSelector(state => state.alerts.settings);
  const notificationsEnabled = alertSettings.enableNotifications;

  const notify = useCallback((message, options = {}) => {
    if (!notificationsEnabled && options.force !== true) {
      return null;
    }

    // Add to Redux store if specified
    if (options.addToRedux) {
      dispatch(addAlert({
        type: options.type || 'info',
        category: options.category || 'system',
        title: options.title || 'Notification',
        message,
        severity: options.severity || 'medium',
        source: 'custom-toast-notification'
      }));
    }

    return addToast(message, options);
  }, [notificationsEnabled, dispatch, addToast]);

  // Vessel notifications
  const vessel = useCallback(() => ({
    statusUpdated: (vesselName, status) => 
      notify(`${vesselName} status updated to ${status}`, {
        type: 'vessel',
        icon: '🚢',
        subtitle: 'Vessel status change detected',
        vesselId: vesselName
      }),
    
    maintenanceScheduled: (vesselName, date) =>
      notify(`Maintenance scheduled for ${vesselName}`, {
        type: 'maintenance',
        icon: '🔧',
        subtitle: `Scheduled for ${date}`,
        vesselId: vesselName,
        addToRedux: true,
        category: 'maintenance'
      }),

    maintenanceCompleted: (vesselName) =>
      notify(`Maintenance completed for ${vesselName}`, {
        type: 'success',
        icon: '✅',
        subtitle: 'All systems operational',
        vesselId: vesselName
      })
  }), [notify]);

  // Biofouling notifications
  const biofouling = useCallback(() => ({
    detected: (vesselName, level) => {
      const isHigh = level > 75;
      const isCritical = level > 90;
      
      return notify(
        `${isCritical ? 'Critical' : isHigh ? 'High' : 'Moderate'} biofouling detected`, 
        {
          type: 'biofouling',
          icon: isCritical ? '🚨' : '🦠',
          subtitle: `${vesselName}: ${level}% fouling coverage`,
          vesselId: vesselName,
          priority: isCritical ? 'high' : 'normal',
          duration: isCritical ? 10000 : 6000, // Critical: 10s, others: 6s
          addToRedux: isHigh,
          category: 'biofouling'
        }
      );
    },

    cleaned: (vesselName, reductionPercentage) =>
      notify(`Hull cleaning completed`, {
        type: 'success',
        icon: '🧽',
        subtitle: `${vesselName}: ${reductionPercentage}% reduction achieved`,
        vesselId: vesselName
      })
  }), [notify]);

  // Fleet notifications
  const fleet = useCallback(() => ({
    dataSynced: (count) =>
      notify(`Fleet data synchronized`, {
        type: 'sync',
        icon: '🔄',
        subtitle: `${count} vessels updated successfully`
      }),
    
    reportGenerated: (reportType) =>
      notify(`${reportType} report generated`, {
        type: 'success',
        icon: '📊',
        subtitle: 'Report is ready for download'
      }),

    alertTriggered: (alertType, vesselCount) =>
      notify(`Fleet alert: ${alertType}`, {
        type: 'warning',
        icon: '⚠️',
        subtitle: `${vesselCount} vessels affected`,
        priority: 'high'
      })
  }), [notify]);

  // Route optimization notifications
  const route = useCallback(() => ({
    optimized: (vesselName, fuelSavings, timeSavings) =>
      notify(`Route optimized for ${vesselName}`, {
        type: 'route',
        icon: '🗺️',
        subtitle: `${fuelSavings}% fuel saved, ${timeSavings}h faster`,
        vesselId: vesselName
      }),

    weatherUpdate: (vesselName, condition) =>
      notify(`Weather update for ${vesselName}`, {
        type: 'weather',
        icon: '🌊',
        subtitle: `Current conditions: ${condition}`,
        vesselId: vesselName
      })
  }), [notify]);

  // ESG notifications
  const esg = useCallback(() => ({
    targetAchieved: (metric, value) =>
      notify(`ESG target achieved: ${metric}`, {
        type: 'esg',
        icon: '🌱',
        subtitle: `Target value: ${value}`
      }),

    emissionReduced: (percentage, period) =>
      notify(`Emissions reduced by ${percentage}%`, {
        type: 'esg',
        icon: '🌍',
        subtitle: `Achievement over ${period}`
      })
  }), [notify]);

  // System notifications
  const system = useCallback(() => ({
    connectionStatus: (isConnected, service = 'marine data services') => {
      const message = isConnected 
        ? `Connected to ${service}`
        : `Connection lost to ${service}`;
      
      return notify(message, {
        type: isConnected ? 'success' : 'error',
        icon: isConnected ? '🟢' : '🔴',
        subtitle: isConnected ? 'All systems operational' : 'Attempting to reconnect...',
        duration: isConnected ? 4000 : 8000, // Success: 4s, Error: 8s
        addToRedux: !isConnected,
        priority: !isConnected ? 'high' : 'normal'
      });
    },
    
    error: (message, details = '') =>
      notify(message, {
        type: 'error',
        icon: '❌',
        subtitle: details,
        duration: 10000, // 10 seconds for errors
        addToRedux: true,
        priority: 'high'
      }),

    dataProcessing: (operation, status = 'processing') => {
      const message = status === 'processing' 
        ? `Processing ${operation}...`
        : `${operation} ${status}`;
      
      return notify(message, {
        type: 'info',
        icon: status === 'processing' ? '⏳' : '⚙️',
        subtitle: status === 'processing' ? 'Please wait...' : ''
      });
    },

    maintenanceMode: (isEnabled) =>
      notify(
        isEnabled ? 'System entering maintenance mode' : 'System maintenance completed',
        {
          type: 'warning',
          icon: isEnabled ? '🔧' : '✅',
          subtitle: isEnabled ? 'Some features may be unavailable' : 'All features restored',
          duration: isEnabled ? 12000 : 6000 // Entering: 12s, Completed: 6s
        }
      )
  }), [notify]);

  // User action notifications
  const user = useCallback(() => ({
    actionCompleted: (action) =>
      notify(action, {
        type: 'success',
        icon: '✅',
        subtitle: 'Action completed successfully'
      }),
    
    actionFailed: (action, error) =>
      notify(`${action} failed`, {
        type: 'error',
        icon: '❌',
        subtitle: error,
        duration: 8000, // 8 seconds for action failures
        addToRedux: true
      }),

    loginSuccess: (userName) =>
      notify(`Welcome back, ${userName}!`, {
        type: 'success',
        icon: '👋',
        subtitle: 'You have been successfully logged in'
      }),

    logoutSuccess: () =>
      notify('Successfully logged out', {
        type: 'info',
        icon: '👋',
        subtitle: 'Thank you for using Barnacle'
      })
  }), [notify]);

  return {
    notify,
    vessel: vessel(),
    biofouling: biofouling(),
    fleet: fleet(),
    route: route(),
    esg: esg(),
    system: system(),
    user: user(),
    notificationsEnabled,
    // Utility methods
    dismissAll: removeAllToasts,
    dismiss: removeToast
  };
};