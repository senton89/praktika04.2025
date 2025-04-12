// src/components/orders/CheckoutForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { clearCart } from '../../store/slices/cartSlice';
import { CreateOrderDto } from '../../types/order';
import orderService from '../../services/orderService';

const CheckoutForm: React.FC = () => {
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        shippingAddress: user?.address || '',
        paymentMethod: 'Credit Card',
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate shipping cost (free for orders over $50)
    const shippingCost = totalAmount > 50 ? 0 : 5.99;

    // Calculate tax (assume 8%)
    const taxRate = 0.08;
    const taxAmount = totalAmount * taxRate;

    // Calculate order total
    const orderTotal = totalAmount + shippingCost + taxAmount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        let isValid = true;

        if (!formData.shippingAddress.trim()) {
            errors.shippingAddress = 'Shipping address is required';
            isValid = false;
        }

        if (!formData.paymentMethod) {
            errors.paymentMethod = 'Payment method is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || items.length === 0) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderData: CreateOrderDto = {
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                orderItems: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };

            const response = await orderService.createOrder(orderData);

            // Clear the cart after successful order
            dispatch(clearCart());

            // Navigate to the order details page
            navigate(`/orders/${response.data.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.errors || 'Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </Button>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Checkout
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 8}}> {/*TODO: test*/}
                        <Typography variant="h6" gutterBottom>
                            Shipping Address
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            id="shippingAddress"
                            name="shippingAddress"
                            label="Shipping Address"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            error={!!formErrors.shippingAddress}
                            helperText={formErrors.shippingAddress}
                            disabled={loading}
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="h6" gutterBottom>
                            Payment Method
                        </Typography>
                        <FormControl component="fieldset" error={!!formErrors.paymentMethod}>
                            <RadioGroup
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="Credit Card"
                                    control={<Radio />}
                                    label="Credit Card"
                                    disabled={loading}
                                />
                                <FormControlLabel
                                    value="PayPal"
                                    control={<Radio />}
                                    label="PayPal"
                                    disabled={loading}
                                />
                                <FormControlLabel
                                    value="Cash on Delivery"
                                    control={<Radio />}
                                    label="Cash on Delivery"
                                    disabled={loading}
                                />
                            </RadioGroup>
                            {formErrors.paymentMethod && (
                                <Typography variant="caption" color="error">
                                    {formErrors.paymentMethod}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4}}> {/*TODO: test*/}
                        <Paper elevation={3} sx={{ p: 2 }}>
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
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default CheckoutForm;