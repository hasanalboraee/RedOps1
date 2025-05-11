import axios from 'axios';
import authService from './authService';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            // Ensure we're using the correct format
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            console.log('Adding auth header:', config.headers.Authorization);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Store any new token from response headers
        const token = response.headers.authorization;
        if (token) {
            authService.setToken(token);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Clear the current token
                authService.logout();
                
                // Redirect to login
                window.location.href = '/login';
                return Promise.reject(error);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 