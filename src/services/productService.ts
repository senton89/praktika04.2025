// src/services/productService.ts
import apiClient from './apiClient';
import { CreateProductDto, UpdateProductDto } from '../types/product';

const productService = {
    getAllProducts: () => {
        return apiClient.get('/products');
    },

    getProductById: (id: number) => {
        return apiClient.get(`/products/${id}`);
    },

    getProductsByCategory: (categoryId: number) => {
        return apiClient.get(`/products/category/${categoryId}`);
    },

    searchProducts: (term: string) => {
        return apiClient.get(`/products/search?term=${term}`);
    },

    createProduct: (productData: CreateProductDto) => {
        return apiClient.post('/products', productData);
    },

    updateProduct: (id: number, productData: UpdateProductDto) => {
        return apiClient.put(`/products/${id}`, productData);
    },

    deleteProduct: (id: number) => {
        return apiClient.delete(`/products/${id}`);
    },
};

export default productService;