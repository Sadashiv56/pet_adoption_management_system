import axios from 'axios';

const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && window.__env && window.__env.REACT_APP_API_URL) return window.__env.REACT_APP_API_URL;
  return 'http://localhost:5000/api';
};

const API = axios.create({ baseURL: getApiUrl() });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
