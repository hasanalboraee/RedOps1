import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import operationReducer from './slices/operationSlice';
import taskReducer from './slices/taskSlice';
import toolReducer from './slices/toolSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        operations: operationReducer,
        tasks: taskReducer,
        tools: toolReducer,
        notifications: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 