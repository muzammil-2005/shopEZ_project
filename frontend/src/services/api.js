import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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
