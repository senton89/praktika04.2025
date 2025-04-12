// src/components/common/EmptyState.tsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionText?: string;
    actionLink?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   title,
                                                   description,
                                                   icon,
                                                   actionText,
                                                   actionLink,
                                                   onAction,
                                               }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
            }}
        >
            {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {description}
            </Typography>
            {actionText && (actionLink || onAction) && (
                <Button
                    variant="contained"
                    color="primary"
                    component={actionLink ? RouterLink : 'button'}
                    to={actionLink}
                    onClick={onAction}
                >
                    {actionText}
                </Button>
            )}
        </Paper>
    );
};

export default EmptyState;