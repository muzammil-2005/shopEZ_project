import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PortfolioDonut = ({ holdings = [], cashBalance = 0 }) => {
  const labels = ['Available Cash', ...holdings.map((h) => h.symbol)];
  const dataValues = [
    cashBalance,
    ...holdings.map((h) => h.quantity * (h.stock?.currentPrice || h.averagePrice)),
  ];

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#14b8a6',
    '#f97316',
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` $${context.parsed.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
