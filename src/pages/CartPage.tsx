// src/pages/CartPage.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useAppSelector } from '../hooks/reduxHooks';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage: React.FC = () => {
    const { items } = useAppSelector((state) => state.cart);

    if (items.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Looks like you haven't added any products to your cart yet.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/products"
                    size="large"
                >
                    Start Shopping
                </Button>
            </Paper>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>
            <Grid container spacing={4}>
                {/*TODO: test*/}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Cart Items ({items.length})
                            </Typography>
                        </Box>
                        {items.map((item) => (
                            <CartItem key={item.product.id} item={item} />
                        ))}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <CartSummary />
                </Grid>
            </Grid>
        </Box>
    );
};

export default CartPage;