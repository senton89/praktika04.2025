// src/pages/CategoriesPage.tsx
import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import CategoryGrid from '../components/categories/CategoryGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCategories } from '../store/slices/categoriesSlice';

const CategoriesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { categories, loading, error } = useAppSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    if (loading) {
        return <LoadingSpinner fullPage message="Loading categories..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Product Categories
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    Browse our product categories to find what you're looking for.
                </Typography>

                <CategoryGrid categories={categories} />
            </Box>
        </Container>
    );
};

export default CategoriesPage;