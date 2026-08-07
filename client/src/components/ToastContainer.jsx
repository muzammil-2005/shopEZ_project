import React from 'react';
import { useToast } from '../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-floating d-flex flex-column gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-white bg-${
            toast.type === 'error' ? 'danger' : toast.type === 'info' ? 'info' : 'success'
          } border-0 shadow-lg`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ borderRadius: '12px', minWidth: '280px' }}
        >
          <div className="d-flex">
            <div className="toast-body d-flex align-items-center gap-2">
              <i
                className={`bi bi-${
                  toast.type === 'error' ? 'exclamation-triangle-fill' : 'check-circle-fill'
                }`}
              ></i>
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};
