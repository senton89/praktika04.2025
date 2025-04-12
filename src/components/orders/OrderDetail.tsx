// src/components/orders/OrderDetail.tsx
import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { OrderDto } from '../../types/order';

interface OrderDetailProps {
    order: OrderDto;
    loading: boolean;
    error: string | null;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, loading, error }) => {
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

    if (!order) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Order not found.</Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Order #{order.id}
                </Typography>
                <Chip
                    label={order.status}
                    color={
                        order.status === 'Delivered'
                            ? 'success'
                            : order.status === 'Processing'
                                ? 'primary'
                                : order.status === 'Shipped'
                                    ? 'info'
                                    : 'default'
                    }
                />
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                    <Typography variant="h6" gutterBottom>
                        Order Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">
                            <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Method:</strong> {order.paymentMethod}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                    <Typography variant="h6" gutterBottom>
                        Shipping Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">
                            <strong>Customer:</strong> {order.userName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Shipping Address:</strong> {order.shippingAddress}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
                Order Items
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3} align="right">
                                <strong>Subtotal</strong>
                            </TableCell>
                            <TableCell align="right">${order.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} align="right">
                                <strong>Shipping</strong>
                            </TableCell>
                            <TableCell align="right">Free</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} align="right">
                                <strong>Total</strong>
                            </TableCell>
                            <TableCell align="right">${order.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrderDetail;