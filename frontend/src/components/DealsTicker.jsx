import React, { useState, useEffect } from 'react';

const DealsTicker = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="featured-deals" className="deals-ticker-bg py-2.5 px-3 rounded-4 mb-4 shadow-sm text-white d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div className="d-flex align-items-center gap-2">
        <span className="badge bg-danger animate-pulse-glow px-2.5 py-1 text-uppercase fw-bold fs-7">
          FLASH DEAL
        </span>
        <span className="fw-extrabold text-light">Monsoon Tech Bonanza: Extra 20% OFF with code <u className="text-warning">SHOPEZ20</u></span>
      </div>

      <div className="d-flex align-items-center gap-1.5 fw-bold bg-black bg-opacity-30 px-3 py-1 rounded-pill">
        <i className="bi bi-clock-history text-warning me-1"></i>
        <span>Ends in:</span>
        <span className="bg-warning text-dark px-2 py-0.5 rounded fw-extrabold small">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        :
        <span className="bg-warning text-dark px-2 py-0.5 rounded fw-extrabold small">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        :
        <span className="bg-warning text-dark px-2 py-0.5 rounded fw-extrabold small">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
};

export default DealsTicker;
