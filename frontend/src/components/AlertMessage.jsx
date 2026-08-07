import React from 'react';

const AlertMessage = ({ variant = 'info', children }) => {
  return (
    <div className={`alert alert-${variant} alert-dismissible fade show rounded-3 shadow-sm`} role="alert">
      {children}
    </div>
  );
};

export default AlertMessage;
