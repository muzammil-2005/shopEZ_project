import React from 'react';

const Rating = ({ value, text, color = '#f59e0b' }) => {
  return (
    <div className="d-flex align-items-center gap-1 text-warning small">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <span key={index}>
            <i
              style={{ color }}
              className={
                value >= index
                  ? 'bi bi-star-fill'
                  : value >= index - 0.5
                  ? 'bi bi-star-half'
                  : 'bi bi-star'
              }
            ></i>
          </span>
        );
      })}
      {text && <span className="ms-1 text-muted font-normal">{text}</span>}
    </div>
  );
};

export default Rating;
