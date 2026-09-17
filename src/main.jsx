import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

// Configure global API URL rewriting for deployments (e.g. on Vercel)
axios.interceptors.request.use((config) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && config.url && config.url.startsWith('http://localhost:8080')) {
    config.url = config.url.replace('http://localhost:8080', apiUrl);
  }
  return config;
});

// Automatically handle 401 Unauthorized (e.g. expired or reseeded sessions)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
