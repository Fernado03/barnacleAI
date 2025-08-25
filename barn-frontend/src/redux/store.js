import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import marineDataReducer from './Slices/marineDataSlice';
import fleetReducer from './Slices/fleetSlice';
import predictionsReducer from './Slices/predictionSlice';
import uiReducer from './Slices/uiSlice';
import alertsReducer from './Slices/alertsSlice';
import esgReducer from './Slices/esgSlice';
import notificationMiddleware from './middleware/notificationMiddleware';

const store = configureStore({
  reducer: {
    user: userReducer,
    marineData: marineDataReducer,
    fleet: fleetReducer,
    predictions: predictionsReducer,
    ui: uiReducer,
    alerts: alertsReducer,
    esg: esgReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp', 'payload.lastUpdate'],
        // Ignore these paths in the state
        ignoredPaths: [
          'items.dates',
          'marineData.ais.lastUpdate',
          'marineData.weather.lastUpdate',
          'marineData.oceanCurrents.lastUpdate',
          'marineData.environmental.lastUpdate',
          'fleet.lastUpdate',
          'predictions.lastUpdate',
          'esg.lastUpdate'
        ],
      },
    }).concat(notificationMiddleware),
});

export default store;