// src/components/home/FeaturedProducts.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import ProductCard from '../products/ProductCard';
import { ProductDto } from '../../types/product';

interface FeaturedProductsProps {
    products: ProductDto[];
    title: string;
    viewAllLink: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
                                                               products,
                                                               title,
                                                               viewAllLink
                                                           }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 6 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Typography variant="h5" component="h2">
                    {title}
                </Typography>
                <Button
                    component={RouterLink}
                    to={viewAllLink}
                    variant="outlined"
                    size="small"
                >
                    View All
                </Button>
            </Box>

            <Grid container spacing={3}>
                {products.slice(0, 4).map((product) => (
                    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}> {/*TODO: test*/}
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeaturedProducts;