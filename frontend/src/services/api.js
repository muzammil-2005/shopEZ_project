import axios from 'axios';

// Determine API base URL dynamically:
// 1. Explicit VITE_API_URL environment variable
// 2. Production host fallback (e.g. *.vercel.app) -> https://shopez-project-t6iy.onrender.com/api
// 3. Localhost development -> http://localhost:5000/api
const getBaseURL = () => {
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    const trimmed = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // Fallback for non-localhost production origins (e.g., Vercel)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://shopez-project-t6iy.onrender.com/api';
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

// Response Interceptor: Detailed console error diagnostics and 401 session clearing
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[ShopEZ API Error] Network/CORS Error: Failed to reach backend at ' + getBaseURL(), error);
    } else {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      if (status === 404) {
        console.error(`[ShopEZ API Error] 404 Endpoint Not Found: ${error.config.url}`);
      } else if (status === 500) {
        console.error(`[ShopEZ API Error] 500 Internal Server Error: ${message}`);
      } else if (status === 400) {
        console.warn(`[ShopEZ API Error] 400 Bad Request: ${message}`);
      } else if (status === 401) {
        console.warn('[ShopEZ API Error] 401 Unauthorized: Clearing expired user session...');
        localStorage.removeItem('shopez_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
