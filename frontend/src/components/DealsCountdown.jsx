import React, { useState, useEffect } from 'react';

const DealsCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => (num < 10 ? `0${num}` : num);

  return (
    <div className="d-flex align-items-center gap-2 bg-danger bg-gradient text-white px-3 py-1.5 rounded-pill shadow-sm">
      <i className="bi bi-clock-history fs-6"></i>
      <span className="fw-bold small me-1">Ends in:</span>
      <div className="d-flex align-items-center gap-1 font-monospace fw-bold">
        <span className="bg-white text-danger px-2 py-0.5 rounded shadow-sm small">
          {formatNum(timeLeft.hours)}h
        </span>
        :
        <span className="bg-white text-danger px-2 py-0.5 rounded shadow-sm small">
          {formatNum(timeLeft.minutes)}m
        </span>
        :
        <span className="bg-white text-danger px-2 py-0.5 rounded shadow-sm small">
          {formatNum(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
};

export default DealsCountdown;
