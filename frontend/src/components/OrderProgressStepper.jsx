import React from 'react';

const OrderProgressStepper = ({ status = 'Processing' }) => {
  const steps = [
    { title: 'Order Placed', icon: 'bi-bag-check' },
    { title: 'Processing', icon: 'bi-gear' },
    { title: 'Shipped', icon: 'bi-box-seam' },
    { title: 'Out for Delivery', icon: 'bi-truck' },
    { title: 'Delivered', icon: 'bi-house-check' },
  ];

  const getStepIndex = (currentStatus) => {
    switch (currentStatus.toLowerCase()) {
      case 'order placed':
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'out for delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const activeIndex = getStepIndex(status);

  return (
    <div className="order-stepper bg-white p-4 rounded-4 shadow-sm mb-4">
      <h6 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
        <i className="bi bi-clock-history text-primary"></i> Order Status Tracking
      </h6>
      <div className="d-flex align-items-center justify-content-between position-relative px-2">
        {/* Connecting Progress Line */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y bg-light w-100"
          style={{ height: '4px', zIndex: 1 }}
        ></div>
        <div
          className="position-absolute top-50 start-0 translate-middle-y bg-success transition-all"
          style={{
            height: '4px',
            width: `${(activeIndex / (steps.length - 1)) * 100}%`,
            zIndex: 1,
            transition: 'width 0.5s ease-in-out',
          }}
        ></div>

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={step.title}
              className="d-flex flex-column align-items-center position-relative text-center"
              style={{ zIndex: 2, minWidth: '70px' }}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border border-2 shadow-sm ${
                  isDone
                    ? 'bg-success text-white border-success'
                    : 'bg-white text-muted border-secondary'
                } ${isCurrent ? 'ring-2 ring-success' : ''}`}
                style={{ width: '42px', height: '42px', transition: 'all 0.3s ease' }}
              >
                <i className={`bi ${step.icon} fs-5`}></i>
              </div>
              <span
                className={`small mt-2 fw-semibold ${
                  isDone ? 'text-success' : 'text-muted'
                }`}
                style={{ fontSize: '0.75rem' }}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressStepper;
