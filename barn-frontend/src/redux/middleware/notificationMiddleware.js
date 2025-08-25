/**
 * Redux middleware to automatically trigger toast notifications
 * for critical alerts and important system events
 * Uses the custom maritime notification system
 */

// Maritime notification types for the custom system
const MARITIME_NOTIFICATION_TYPES = {
  VESSEL_UPDATE: 'vessel',
  MAINTENANCE: 'maintenance', 
  BIOFOULING: 'biofouling',
  ROUTE_OPTIMIZATION: 'route',
  WEATHER_ALERT: 'weather',
  FLEET_OPERATION: 'fleet',
  ESG_UPDATE: 'esg',
  DATA_SYNC: 'sync',
  USER_ACTION: 'success',
  SYSTEM: 'info'
};

// Global reference to the notification system
// This will be set by the MaritimeToastProvider
let globalNotificationSystem = null;

export const setGlobalNotificationSystem = (notificationSystem) => {
  globalNotificationSystem = notificationSystem;
};

export const notificationMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Get current state after action
  const state = store.getState();
  const alertSettings = state.alerts?.settings;
  
  // Only proceed if notifications are enabled and we have the notification system
  if (!alertSettings?.enableNotifications || !globalNotificationSystem) {
    return result;
  }

  // Handle different action types
  switch (action.type) {
    case 'alerts/addAlert': {
      const alert = action.payload;
      
      // Auto-toast critical and high severity alerts
      if (alert.severity === 'high' || alert.severity === 'critical') {
        const icon = getAlertIcon(alert.category);
        const message = `${alert.title}: ${alert.message}`;
        
        globalNotificationSystem.addToast(message, {
          type: alert.type === 'error' ? 'error' : 'warning',
          icon: icon,
          duration: alert.severity === 'critical' ? 12000 : 6000, // Critical: 12s, High: 6s
          priority: alert.severity === 'critical' ? 'high' : 'normal',
          subtitle: alert.severity === 'critical' ? 'Critical Alert - Please Acknowledge' : undefined
        });
      }
      break;
    }

    case 'marineData/fetchAISData/fulfilled':
    case 'marineData/fetchWeatherData/fulfilled':
    case 'marineData/fetchOceanCurrentsData/fulfilled': {
      // Success notifications for data updates
      const dataType = action.type.includes('AIS') ? 'AIS' : 
                      action.type.includes('Weather') ? 'Weather' : 'Ocean currents';
      
      globalNotificationSystem.addToast(`${dataType} data updated successfully`, {
        type: 'sync',
        icon: '🔄',
        duration: 2000
      });
      break;
    }

    case 'fleet/scheduleMaintenanceAsync/fulfilled': {
      const { vesselName, date } = action.meta.arg;
      globalNotificationSystem.addToast(`Maintenance scheduled for ${vesselName}`, {
        type: 'maintenance',
        icon: '🔧',
        subtitle: `Scheduled for ${date}`,
        vesselId: vesselName,
        duration: 4000
      });
      break;
    }

    case 'predictions/generatePredictions/fulfilled': {
      globalNotificationSystem.addToast('Biofouling predictions updated', {
        type: 'biofouling',
        icon: '🧠',
        duration: 3000
      });
      break;
    }

    case 'esg/updateESGTargets/fulfilled': {
      globalNotificationSystem.addToast('ESG targets updated successfully', {
        type: 'esg',
        icon: '🌱',
        duration: 3000
      });
      break;
    }

    // Error handling
    case 'marineData/fetchAISData/rejected':
    case 'marineData/fetchWeatherData/rejected':
    case 'fleet/fetchFleetData/rejected': {
      globalNotificationSystem.addToast('Failed to sync marine data', {
        type: 'error',
        icon: '⚠️',
        duration: 8000 // 8 seconds for data sync errors
      });
      break;
    }

    default:
      break;
  }

  return result;
};

/**
 * Get appropriate icon for alert category
 */
function getAlertIcon(category) {
  const icons = {
    biofouling: '🦠',
    maintenance: '🔧',
    fuel: '⛽',
    weather: '🌊',
    system: '⚙️',
    fleet: '⚓',
    environmental: '🌱'
  };
  
  return icons[category] || '📢';
}

export default notificationMiddleware;