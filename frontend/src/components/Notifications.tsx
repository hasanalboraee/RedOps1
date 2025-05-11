import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { websocketService } from '../services/websocket';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
}

const Notifications: React.FC = () => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Keyboard shortcut for notifications
    useKeyboardShortcuts([
        {
            key: 'n',
            ctrlKey: true,
            handler: (e) => {
                e.preventDefault();
                setAnchorEl(document.getElementById('notifications-button'));
            },
        },
    ]);

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // TODO: Replace with actual API call
                const response = await fetch('/api/notifications');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        const handleNewNotification = (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        websocketService.on('notification', handleNewNotification);

        return () => {
            websocketService.off('notification', handleNewNotification);
        };
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read
            await fetch(`/api/notifications/${notification.id}/read`, {
                method: 'POST',
            });

            setNotifications(notifications.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            ));

            // Navigate to link if provided
            if (notification.link) {
                window.location.href = notification.link;
            }

            handleClose();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'POST',
            });

            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'error':
                return <ErrorIcon color="error" />;
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'info':
                return <InfoIcon color="info" />;
            default:
                return <InfoIcon />;
        }
    };

    return (
        <>
            <IconButton
                id="notifications-button"
                color="inherit"
                onClick={handleClick}
                sx={{ ml: 1 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 360, maxHeight: 480 },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarkAllRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Box>
                <Divider />
                <List sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="No notifications"
                                secondary="You're all caught up!"
                            />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                                }}
                            >
                                <ListItemIcon>
                                    {getNotificationIcon(notification.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {notification.message}
                                            </Typography>
                                            <br />
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {notification.timestamp}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Menu>
        </>
    );
};

export default Notifications; 