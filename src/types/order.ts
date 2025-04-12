// src/types/order.ts
export interface OrderItemDto {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderDto {
    id: number;
    userId: number;
    userName: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    orderItems: OrderItemDto[];
}

export interface CreateOrderItemDto {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    shippingAddress: string;
    paymentMethod: string;
    orderItems: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
    status: string;
}