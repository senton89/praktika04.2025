// src/components/common/Notification.tsx
import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface NotificationProps {
    open: boolean;
    message: string;
    severity?: AlertProps['severity'];
    duration?: number;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
                                                       open,
                                                       message,
                                                       severity = 'success',
                                                       duration = 6000,
                                                       onClose,
                                                   }) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsOpen(false);
        onClose();
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;