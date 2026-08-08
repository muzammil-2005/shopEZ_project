import axios from 'axios';

// Determine API base URL dynamically for local vs public tunnel deployment
const getBaseURL = () => {
  // 1. Check environment variables (Vercel / Production deployment)
  const envUrl = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 
                 (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL);
  if (envUrl) {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // 2. Fallback to LocalTunnel URL if domain ends with .loca.lt
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.endsWith('.loca.lt')) {
      return 'https://shopez-backend-api.loca.lt/api';
    }
  }

  // 3. Fallback local development backend URL
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'bypass-tunnel-reminder': 'true',
    'Bypass-Tunnel-Reminder': '1',
  },
});

// Request Interceptor: Inject JWT Bearer Token if present
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('shopez_user')
    ? JSON.parse(localStorage.getItem('shopez_user'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  config.headers['bypass-tunnel-reminder'] = 'true';
  config.headers['Bypass-Tunnel-Reminder'] = '1';
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
