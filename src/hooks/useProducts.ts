// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { ProductDto } from '../types/product';

export const useProducts = (categoryId?: number, searchTerm?: string) => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response;

                if (categoryId) {
                    response = await productService.getProductsByCategory(categoryId);
                } else if (searchTerm) {
                    response = await productService.searchProducts(searchTerm);
                } else {
                    response = await productService.getAllProducts();
                }

                setProducts(response.data.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, searchTerm]);

    return { products, loading, error };
};