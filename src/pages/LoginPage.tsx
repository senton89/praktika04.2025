// src/pages/LoginPage.tsx
import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" paragraph>
                    Sign in to your account to access your profile, orders, and more.
                </Typography>

                <LoginForm />
            </Box>
        </Container>
    );
};

export default LoginPage;