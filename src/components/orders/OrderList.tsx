// src/components/orders/OrderList.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress
} from '@mui/material';
import { OrderDto } from '../../types/order';

interface OrderListProps {
    orders: OrderDto[];
    loading: boolean;
    error: string | null;
}

const OrderList: React.FC<OrderListProps> = ({ orders, loading, error }) => {
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

    if (orders.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    No Orders Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    You haven't placed any orders yet.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/products"
                    variant="contained"
                    color="primary"
                >
                    Start Shopping
                </Button>
            </Paper>
        );
    }

    return (
                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>
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
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        component={RouterLink}
                                        to={`/orders/${order.id}`}
                                        variant="outlined"
                                        size="small"
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    export default OrderList;