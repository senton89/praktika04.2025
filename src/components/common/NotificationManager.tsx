// src/components/common/NotificationManager.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { hideNotification } from '../../store/slices/uiSlice';
import Notification from './Notification';

const NotificationManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.ui.notifications);

    const handleClose = (id: string) => {
        dispatch(hideNotification(id));
    };

    return (
        <>
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    open={true}
                    message={notification.message}
                    severity={notification.severity}
                    duration={notification.duration}
                    onClose={() => handleClose(notification.id)}
                />
            ))}
        </>
    );
};

export default NotificationManager;