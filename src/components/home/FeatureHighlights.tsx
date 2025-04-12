// src/components/home/FeatureHighlights.tsx
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
    LocalShipping as ShippingIcon,
    Security as SecurityIcon,
    Support as SupportIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}
        >
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'primary.light',
                    borderRadius: '50%',
                    color: 'primary.contrastText'
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </Paper>
    );
};

const FeatureHighlights: React.FC = () => {
    const features = [
        {
            icon: <ShippingIcon fontSize="large" />,
            title: 'Free Shipping',
            description: 'Free shipping on all orders over $50'
        },
        {
            icon: <SecurityIcon fontSize="large" />,
            title: 'Secure Payments',
            description: 'All payments are processed securely'
        },
        {
            icon: <SupportIcon fontSize="large" />,
            title: '24/7 Support',
            description: 'Our support team is always available'
        },
        {
            icon: <PaymentIcon fontSize="large" />,
            title: 'Easy Returns',
            description: '30-day money-back guarantee'
        }
    ];

    return (
        <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
            <Grid container spacing={3}>
                {features.map((feature, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}> {/*TODO: test*/}
                        <Feature
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeatureHighlights;