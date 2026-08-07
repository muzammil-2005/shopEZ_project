import React, { useState } from 'react';

const PincodeChecker = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian Pincode.');
      setDeliveryResult(null);
      return;
    }

    setError('');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedTomorrow = tomorrow.toLocaleDateString('en-IN', dateOptions);

    setDeliveryResult({
      pincode,
      date: formattedTomorrow,
      express: true,
      codAvailable: true,
      freeDelivery: true,
    });
  };

  return (
    <div className="pincode-box p-3 bg-light rounded-4 border border-1 mb-4">
      <div className="d-flex align-items-center gap-2 mb-2">
        <i className="bi bi-geo-alt-fill text-primary"></i>
        <span className="fw-bold small text-dark">Delivery & Services</span>
      </div>

      <form onSubmit={handleCheck} className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-sm border-end-0 rounded-start-pill ps-3"
          placeholder="Enter 6-digit Pincode (e.g. 110001)"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm rounded-end-pill px-3 fw-semibold"
        >
          Check
        </button>
      </form>

      {error && <div className="text-danger extra-small">{error}</div>}

      {deliveryResult && (
        <div className="mt-3 p-2 bg-white rounded-3 border border-light shadow-sm">
          <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-1">
            <i className="bi bi-truck fs-6"></i>
            <span>FREE Delivery by {deliveryResult.date}, 5 PM</span>
          </div>
          <div className="d-flex gap-3 text-muted extra-small ms-4">
            <span><i className="bi bi-cash-coin me-1"></i> Cash on Delivery Available</span>
            <span><i className="bi bi-arrow-return-left me-1"></i> 7 Days Replacement</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
