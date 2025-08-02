import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification from '../components/ui/Notification';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (title, message, options = {}) => addToast({ type: 'success', title, message, ...options }),
    error: (title, message, options = {}) => addToast({ type: 'error', title, message, ...options }),
    info: (title, message, options = {}) => addToast({ type: 'info', title, message, ...options }),
    warning: (title, message, options = {}) => addToast({ type: 'warning', title, message, ...options }),
    loading: (title, message, options = {}) => addToast({ type: 'loading', title, message, duration: 0, ...options }),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toastItem) => (
            <Notification
              key={toastItem.id}
              type={toastItem.type}
              title={toastItem.title}
              message={toastItem.message}
              duration={toastItem.duration}
              onClose={() => removeToast(toastItem.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};