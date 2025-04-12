// src/components/common/ErrorDisplay.tsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
    error: string | null;
    retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, retry }) => {
    if (!error) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffebee',
                borderRadius: 2,
                mb: 3,
            }}
        >
            <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
                Oops! Something went wrong
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: retry ? 2 : 0 }}>
                {error}
            </Typography>
            {retry && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={retry}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            )}
        </Paper>
    );
};

export default ErrorDisplay;