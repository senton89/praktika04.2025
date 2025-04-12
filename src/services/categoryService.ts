// src/services/categoryService.ts
import apiClient from './apiClient';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';

const categoryService = {
    getAllCategories: () => {
        return apiClient.get('/categories');
    },

    getCategoryById: (id: number) => {
        return apiClient.get(`/categories/${id}`);
    },

    createCategory: (categoryData: CreateCategoryDto) => {
        return apiClient.post('/categories', categoryData);
    },

    updateCategory: (id: number, categoryData: UpdateCategoryDto) => {
        return apiClient.put(`/categories/${id}`, categoryData);
    },

    deleteCategory: (id: number) => {
        return apiClient.delete(`/categories/${id}`);
    },
};

export default categoryService;