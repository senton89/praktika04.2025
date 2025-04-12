// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Grid,
    TextField,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Divider,
    List,
    ListItem,
    ListItemText,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { clearCart } from '../store/slices/cartSlice';
import orderService from '../services/orderService';
import { CreateOrderDto, CreateOrderItemDto } from '../types/order';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);

    const [activeStep, setActiveStep] = useState(0);
    const [shippingAddress, setShippingAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate additional costs
    const shippingCost = totalAmount > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const taxAmount = totalAmount * taxRate;
    const orderTotal = totalAmount + shippingCost + taxAmount;

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handlePlaceOrder();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handlePlaceOrder = async () => {
        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const orderItems: CreateOrderItemDto[] = items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }));

            const orderData: CreateOrderDto = {
                shippingAddress,
                paymentMethod,
                orderItems
            };

            const response = await orderService.createOrder(orderData);

            // Clear the cart after successful order
            dispatch(clearCart());

            // Navigate to the order details page
            navigate(`/orders/${response.data.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Shipping address
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="firstName"
                                    name="firstName"
                                    label="First name"
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                    defaultValue={user?.firstName || ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="lastName"
                                    name="lastName"
                                    label="Last name"
                                    fullWidth
                                    autoComplete="family-name"
                                    variant="outlined"
                                    defaultValue={user?.lastName || ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="address"
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    autoComplete="shipping address-line1"
                                    variant="outlined"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    autoComplete="shipping address-level2"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="zip"
                                    name="zip"
                                    label="Zip / Postal code"
                                    fullWidth
                                    autoComplete="shipping postal-code"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="country"
                                    name="country"
                                    label="Country"
                                    fullWidth
                                    autoComplete="shipping country"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <TextField
                                    required
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Phone Number"
                                    fullWidth
                                    autoComplete="tel"
                                    variant="outlined"
                                    defaultValue={user?.phoneNumber || ''}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Payment method
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Payment Method"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel
                                    value="Credit Card"
                                    control={<Radio />}
                                    label="Credit Card"
                                />
                                <FormControlLabel
                                    value="PayPal"
                                    control={<Radio />}
                                    label="PayPal"
                                />
                                <FormControlLabel
                                    value="Cash on Delivery"
                                    control={<Radio />}
                                    label="Cash on Delivery"
                                />
                            </RadioGroup>
                        </FormControl>
                        {paymentMethod === 'Credit Card' && (
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12 }}> {/*TODO: test*/}
                                    <TextField
                                        required
                                        id="cardName"
                                        label="Name on card"
                                        fullWidth
                                        autoComplete="cc-name"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}> {/*TODO: test*/}
                                    <TextField
                                        required
                                        id="cardNumber"
                                        label="Card number"
                                        fullWidth
                                        autoComplete="cc-number"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                    <TextField
                                        required
                                        id="expDate"
                                        label="Expiry date"
                                        fullWidth
                                        autoComplete="cc-exp"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                    <TextField
                                        required
                                        id="cvv"
                                        label="CVV"
                                        helperText="Last three digits on signature strip"
                                        fullWidth
                                        autoComplete="cc-csc"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Order summary
                        </Typography>
                        <List disablePadding>
                            {items.map((item) => (
                                <ListItem key={item.product.id} sx={{ py: 1, px: 0 }}>
                                    <ListItemText
                                        primary={item.product.name}
                                        secondary={`Quantity: ${item.quantity}`}
                                    />
                                    <Typography variant="body2">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Subtotal" />
                                <Typography variant="body1">
                                    ${totalAmount.toFixed(2)}
                                </Typography>
                            </ListItem>

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Shipping" />
                                <Typography variant="body1">
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                </Typography>
                            </ListItem>

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Tax (8%)" />
                                <Typography variant="body1">
                                    ${taxAmount.toFixed(2)}
                                </Typography>
                            </ListItem>

                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Total" />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    ${orderTotal.toFixed(2)}
                                </Typography>
                            </ListItem>
                        </List>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, md: 8 }}> {/*TODO: test*/}
                                <Typography variant="h6" gutterBottom>
                                    Shipping
                                </Typography>
                                <Typography gutterBottom>{user?.firstName} {user?.lastName}</Typography>
                                <Typography gutterBottom>{shippingAddress}</Typography>
                            </Grid>

                            <Grid container direction="column" size={{ xs: 12, md: 8 }}>{/*TODO: test*/}
                                <Typography variant="h6" gutterBottom>
                                    Payment details
                                </Typography>
                                <Typography gutterBottom>{paymentMethod}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                throw new Error('Unknown step');
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Checkout
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {getStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mr: 1 }} disabled={loading}>
                            Back
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={loading || items.length === 0}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : activeStep === steps.length - 1 ? (
                            'Place order'
                        ) : (
                            'Next'
                        )}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CheckoutPage;