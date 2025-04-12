// src/pages/OrderDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAppSelector } from '../hooks/reduxHooks';
import orderService from '../services/orderService';
import { OrderDto } from '../types/order';

const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [order, setOrder] = useState<OrderDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await orderService.getOrderById(Number(id));
                setOrder(response.data.data);

                // Check if the order belongs to the current user
                if (response.data.data.userId !== user?.id) {
                    navigate('/orders');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id, navigate, user?.id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!order) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                Order not found
            </Alert>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'shipped':
                return 'primary';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Order Details
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                        <Typography variant="subtitle2" color="text.secondary">
                            Order Number
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            #{order.id}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            Order Date
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {formatDate(order.orderDate)}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            sx={{ mb: 1 }}
                        />

                        <Typography variant="subtitle2" color="text.secondary">
                            Payment Method
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {order.paymentMethod}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}> {/*TODO: test*/}
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary">
                            Shipping Address
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {order.shippingAddress}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" gutterBottom>
                Order Items
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell component="th" scope="row">
                                    {item.productName}
                                </TableCell>
                                <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell align="right">
                                <Typography variant="subtitle1">Subtotal</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1">${order.totalAmount.toFixed(2)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell align="right">
                                <Typography variant="subtitle1">Total</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    ${order.totalAmount.toFixed(2)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                >
                    Back to Orders
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.print()}
                >
                    Print Order
                </Button>
            </Box>
        </Box>
    );
};

export default OrderDetailPage;