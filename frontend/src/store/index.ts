import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import operationReducer from './slices/operationSlice';
import taskReducer from './slices/taskSlice';
import toolReducer from './slices/toolSlice';
import notificationReducer from './slices/notificationSlice';
import toolsReducer from './slices/toolsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        operations: operationReducer,
        tasks: taskReducer,
        tools: toolsReducer,
        notifications: notificationReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 