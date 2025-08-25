import { useContext } from 'react';
import { ToastContext } from '../components/shared/MaritimeToast';

export const useMaritimeToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useMaritimeToast must be used within MaritimeToastProvider');
  }
  return context;
};