// src/components/cart/CartSummary.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button, Divider } from '@mui/material';
import { useAppSelector } from '../../hooks/reduxHooks';

const CartSummary: React.FC = () => {
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: '/checkout' } });
        }
    };

    // Calculate shipping cost (free for orders over $50)
    const shippingCost = totalAmount > 50 ? 0 : 5.99;

    // Calculate tax (assume 8%)
    const taxRate = 0.08;
    const taxAmount = totalAmount * taxRate;

    // Calculate order total
    const orderTotal = totalAmount + shippingCost + taxAmount;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>

            <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal ({items.length} items)</Typography>
                    <Typography variant="body1">${totalAmount.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Shipping</Typography>
                    <Typography variant="body1">
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tax (8%)</Typography>
                    <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">${orderTotal.toFixed(2)}</Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={items.length === 0}
            >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </Button>

            {totalAmount < 50 && totalAmount > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Add ${(50 - totalAmount).toFixed(2)} more to qualify for free shipping!
                </Typography>
            )}
        </Paper>
    );
};

export default CartSummary;