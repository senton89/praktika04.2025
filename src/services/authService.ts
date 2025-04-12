// src/services/authService.ts
import apiClient from './apiClient';
import { LoginDto, CreateUserDto } from '../types/auth';

const authService = {
    login: (credentials: LoginDto) => {
        return apiClient.post('/Auth/login', credentials);
    },

    register: (userData: CreateUserDto) => {
        return apiClient.post('/Auth/register', userData);
    },

    updateProfile: (userId: number, userData: any) => {
        return apiClient.put(`/users/${userId}`, userData);
    },

    getUserProfile: (userId: number) => {
        return apiClient.get(`/users/${userId}`);
    },
};

export default authService;