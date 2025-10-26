import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' && <i className="fas fa-check-circle"></i>}
      {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;