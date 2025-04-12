// src/store/slices/ordersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderDto } from '../../types/order';
import orderService from '../../services/orderService';

interface OrdersState {
    orders: OrderDto[];
    order: OrderDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
};

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await orderService.getUserOrders(userId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId: number, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrderById(orderId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: any, { rejectWithValue }) => {
        try {
            const response = await orderService.createOrder(orderData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default ordersSlice.reducer;