// src/pages/CategoryProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCategoryById } from '../store/slices/categoriesSlice';
import productService from '../services/productService';
import { ProductDto } from '../types/product';

const CategoryProductsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { category, loading: categoryLoading, error: categoryError } = useAppSelector((state) => state.categories);

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchCategoryById(Number(id)));
        }
    }, [dispatch, id]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await productService.getProductsByCategory(Number(id));
                setProducts(response.data.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    if (categoryLoading || loading) {
        return <LoadingSpinner fullPage message="Loading category products..." />;
    }

    if (categoryError || error) {
        return <ErrorDisplay error={categoryError || error} />;
    }

    if (!category) {
        return <ErrorDisplay error="Category not found" />;
    }

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Link component={RouterLink} to="/" color="inherit">
                        Home
                    </Link>
                    <Link component={RouterLink} to="/categories" color="inherit">
                        Categories
                    </Link>
                    <Typography color="text.primary">{category.name}</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" gutterBottom>
                    {category.name}
                </Typography>

                {category.description && (
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {category.description}
                    </Typography>
                )}

                <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                    title={`Products in ${category.name}`}
                />
            </Box>
        </Container>
    );
};

export default CategoryProductsPage;