import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types/models';
import { userApi } from '../../services/api';

interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async () => {
        const response = await userApi.getAll();
        return response.data;
    }
);

export const createUser = createAsyncThunk(
    'users/create',
    async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await userApi.create(user);
        return response.data;
    }
);

export const updateUser = createAsyncThunk(
    'users/update',
    async ({ id, user }: { id: string; user: Partial<User> }) => {
        const response = await userApi.update(id, user);
        return response.data;
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id: string) => {
        await userApi.delete(id);
        return id;
    }
);

// Helper to ensure every user has an id field
function mapUserId(user) {
    if (!user) return user;
    if (user.id) return user;
    if (user._id) return { ...user, id: user._id };
    return user;
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
        },
        logout: (state) => {
            state.currentUser = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.map(mapUserId);
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create user';
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update user';
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete user';
            });
    },
});

export const { setCurrentUser, logout, clearError } = userSlice.actions;
export default userSlice.reducer; 