// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAppSelector } from './reduxHooks';
import authService from '../services/authService';

export const useAuth = () => {
    const { user, token, isAuthenticated, loading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Verify token validity on component mount
        const verifyToken = async () => {
            if (token) {
                try {
                    // TODO: implement a token verification endpoint
                    // For now, we'll just check if we can get the user profile
                    if (user) {
                        await authService.getUserProfile(user.id);
                    }
                } catch (error) {
                    // Token is invalid, handle in your auth slice
                    console.error('Token verification failed', error);
                    // You might want to dispatch a logout action here
                }
            }
        };

        verifyToken();
    }, [token, user]);

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error
    };
};