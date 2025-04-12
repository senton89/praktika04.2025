// src/components/products/ProductList.tsx (обновленный)
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import { ProductDto } from '../../types/product';
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';

interface ProductListProps {
    products: ProductDto[];
    loading: boolean;
    error: string | null;
    title?: string;
    itemsPerPage?: number;
}

const ProductList: React.FC<ProductListProps> = ({
                                                     products,
                                                     loading,
                                                     error,
                                                     title,
                                                     itemsPerPage = 12
                                                 }) => {
    const [page, setPage] = useState(1);
    const [paginatedProducts, setPaginatedProducts] = useState<ProductDto[]>([]);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        // Reset to first page when products change
        setPage(1);

        // Calculate total pages
        const totalPages = Math.ceil(products.length / itemsPerPage);
        setPageCount(totalPages || 1);

        // Get products for the current page
        updatePaginatedProducts(1);
    }, [products, itemsPerPage]);

    const updatePaginatedProducts = (currentPage: number) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedProducts(products.slice(startIndex, endIndex));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        updatePaginatedProducts(value);

        // Scroll to top of the product list
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (products.length === 0) {
        return (
            <EmptyState
                title="No products found"
                description="We couldn't find any products matching your criteria."
                icon={<ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary' }} />}
                actionText="Clear filters"
                onAction={() => window.location.href = '/products'}
            />
        );
    }

    return (
        <Box sx={{ mb: 4 }}>
            {title && (
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {paginatedProducts.length} of {products.length} products
            </Typography>

            <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}> {/*TODO: test*/}
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
            />
        </Box>
    );
};

export default ProductList;