// src/pages/RegisterPage.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create an Account
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" paragraph>
                    Join us to enjoy a personalized shopping experience, order tracking, and more.
                </Typography>

                <RegisterForm />
            </Box>
        </Container>
    );
};

export default RegisterPage;