// src/services/orderService.ts
import apiClient from './apiClient';
import { CreateOrderDto, UpdateOrderStatusDto } from '../types/order';

const orderService = {
    getOrderById: (id: number) => {
        return apiClient.get(`/orders/${id}`);
    },

    getUserOrders: (userId: number) => {
        return apiClient.get(`/orders/user/${userId}`);
    },

    createOrder: (orderData: CreateOrderDto) => {
        return apiClient.post('/orders', orderData);
    },

    updateOrderStatus: (id: number, statusData: UpdateOrderStatusDto) => {
        return apiClient.put(`/orders/${id}/status`, statusData);
    },
};

export default orderService;