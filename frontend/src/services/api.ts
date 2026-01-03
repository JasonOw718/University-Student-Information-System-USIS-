import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Best practice: use import.meta.env.VITE_API_URL but hardcoding for now as per plan
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            // Note: Direct navigation outside component is tricky, so we rely on App routing to check auth or handle it in components
            localStorage.removeItem('token');
            // optionally window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;
