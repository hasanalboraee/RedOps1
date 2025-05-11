import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { LoginCredentials, User } from '../types/models';
import { store } from '../store';
import { setUser, clearUser } from '../store/slices/authSlice';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authService = {
    async login(credentials: LoginCredentials): Promise<User> {
        try {
            console.log('Sending login request with:', credentials);
            const response = await axiosInstance.post('/auth/login', credentials);
            console.log('Login response:', response.data);
            
            // Get token from Authorization header
            const token = response.headers.authorization;
            if (!token) {
                console.error('No token in response headers');
                throw new Error('Invalid login response: missing token in headers');
            }

            // Store the token and user data
            this.setToken(token);
            this.setUser(response.data);
            
            // Update Redux store
            store.dispatch(setUser(response.data));
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || 'Failed to login';
                console.error('Login error details:', error.response?.data);
                throw new Error(message);
            }
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // Remove Authorization header
        delete axiosInstance.defaults.headers.common['Authorization'];
        // Clear Redux store
        store.dispatch(clearUser());
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token: string): void {
        if (!token) {
            console.error('Attempted to set null or undefined token');
            return;
        }
        // Remove 'Bearer ' prefix if present
        const cleanToken = token.replace('Bearer ', '');
        localStorage.setItem(TOKEN_KEY, cleanToken);
        // Set default Authorization header for all future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
    },

    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser(user: User): void {
        if (!user) {
            console.error('Attempted to set null or undefined user');
            return;
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    // Initialize auth state
    initialize(): void {
        const token = this.getToken();
        const user = this.getUser();
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        if (user) {
            store.dispatch(setUser(user));
        }
    }
};

export default authService; 