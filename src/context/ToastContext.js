'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = 'var(--primary)';
          if (toast.type === 'success') {
            Icon = CheckCircle;
            iconColor = 'var(--success)';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            iconColor = 'var(--error)';
          }

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <Icon size={18} style={{ color: iconColor }} />
              <span className="toast-message">{toast.message}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close toast">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
