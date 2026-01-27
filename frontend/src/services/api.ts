import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: '', 
    headers: { "Content-Type": "application/json" },
});

let configPromise: Promise<string> | null = null;

// Function to fetch the config once
async function fetchBaseUrl(): Promise<string> {
    try {
        const res = await fetch("/config.json");
        const cfg = await res.json();
        api.defaults.baseURL = cfg.apiBaseUrl;
        return cfg.apiBaseUrl;
    } catch (err) {
        console.error("Failed to load config.json", err);
        return "http://localhost:8080/api"; // Fallback
    }
}

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (!configPromise) {
            configPromise = fetchBaseUrl();
        }
        
        const baseUrl = await configPromise;
        config.baseURL = baseUrl;

        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;