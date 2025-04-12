// src/pages/OrdersPage.tsx
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import OrderList from '../components/orders/OrderList';
import { fetchUserOrders } from '../store/slices/ordersSlice';

const OrdersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserOrders(user.id));
        }
    }, [dispatch, user]);

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>
            <OrderList orders={orders} loading={loading} error={error} />
        </Box>
    );
};

export default OrdersPage;