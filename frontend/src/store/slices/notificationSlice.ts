import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: []
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now()
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        }
    }
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 