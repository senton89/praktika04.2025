// src/components/products/ProductDetail.tsx (обновленный)
import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Divider, TextField, Paper, Chip, Alert } from '@mui/material';
import { ProductDto } from '../../types/product';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addToCart } from '../../store/slices/cartSlice';
import ProductRating from './ProductRating';
import ProductPrice from './ProductPrice';

interface ProductDetailProps {
    product: ProductDto;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const dispatch = useAppDispatch();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.stockQuantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    return (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            {addedToCart && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Product added to cart successfully!
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 500,
                            objectFit: 'contain',
                            mb: 2,
                        }}
                        src={product.imageUrl || 'https://via.placeholder.com/500'}
                        alt={product.name}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                    <Typography variant="h4" component="h1" gutterBottom>
                        {product.name}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <ProductRating value={4} count={24} size="medium" />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <ProductPrice price={product.price} size="large" />
                    </Box>

                    <Chip
                        label={product.categoryName}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            Availability:
                        </Typography>
                        <Chip
                            label={product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            color={product.stockQuantity > 0 ? 'success' : 'error'}
                            size="small"
                        />
                    </Box>

                    {product.stockQuantity > 0 && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {product.stockQuantity} items available
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {product.stockQuantity > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                InputProps={{ inputProps: { min: 1, max: product.stockQuantity } }}
                                value={quantity}
                                onChange={handleQuantityChange}
                                sx={{ width: 100, mr: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    ) : (
                        <Button variant="contained" color="primary" size="large" disabled>
                            Out of Stock
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProductDetail;