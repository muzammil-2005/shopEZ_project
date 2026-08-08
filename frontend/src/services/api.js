import axios from 'axios';

// Determine API base URL dynamically:
// 1. Explicit VITE_API_URL environment variable
// 2. Production host fallback (e.g. *.vercel.app) -> https://shopez-backend-api.onrender.com/api
// 3. Localhost development -> http://localhost:5000/api
const getBaseURL = () => {
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    const trimmed = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // Fallback for non-localhost production origins (e.g., Vercel)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://shopez-backend-api.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Request Interceptor: Inject JWT Bearer Token if present
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('shopez_user')
    ? JSON.parse(localStorage.getItem('shopez_user'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// Response Interceptor: Auto-clear expired/stale tokens on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('401 Unauthorized detected. Clearing expired user token...');
      localStorage.removeItem('shopez_user');
    }
    return Promise.reject(error);
  }
);

export default API;
