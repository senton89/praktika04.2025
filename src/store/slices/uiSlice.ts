// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: string;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface UiState {
    notifications: Notification[];
    isLoading: boolean;
    searchTerm: string;
}

const initialState: UiState = {
    notifications: [],
    isLoading: false,
    searchTerm: '',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
            const id = Date.now().toString();
            state.notifications.push({
                id,
                ...action.payload,
            });
        },
        hideNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { showNotification, hideNotification, setLoading, setSearchTerm } = uiSlice.actions;
export default uiSlice.reducer;