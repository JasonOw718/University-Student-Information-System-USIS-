import api from './api';

export interface UserSignupRequest {
    name: string;
    email: string;
    password?: string; 
    icNumber?: string;
    phoneNumber?: string;
    address?: string;
    role?: 'student' | 'lecturer'; 
}

export interface LecturerSignUpRequest {
    name: string;
    email: string;
    password?: string;
}

export interface AuthRequest {
    email: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    role: string;
    name: string;
}

export const authService = {
    registerStudent: async (data: UserSignupRequest) => {
        const response = await api.post<AuthResponse>('/auth/register/student', data);
        return response.data;
    },

    registerLecturer: async (data: LecturerSignUpRequest) => {
        const response = await api.post<AuthResponse>('/auth/register/lecturer', data);
        return response.data;
    },

    login: async (data: AuthRequest) => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_role', response.data.role.toLowerCase());
            localStorage.setItem('user_name', response.data.name);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        return token ? {
            token,
            role: localStorage.getItem('user_role'),
            name: localStorage.getItem('user_name')
        } : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
