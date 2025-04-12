// src/components/products/RecommendedProducts.tsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ProductDto } from '../../types/product';
import ProductCard from './ProductCard';

interface RecommendedProductsProps {
    products: ProductDto[];
    title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
                                                                     products,
                                                                     title = 'You might also like'
                                                                 }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {title}
            </Typography>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}> {/*TODO: test*/}
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RecommendedProducts;