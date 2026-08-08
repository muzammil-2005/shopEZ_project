import axios from 'axios';

// Determine API base URL dynamically using environment variables
const getBaseURL = () => {
  // 1. Production environment variable (Vercel / Cloud deployment)
  const envUrl = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 
                 (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL);
  if (envUrl) {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // 2. Local development fallback
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
