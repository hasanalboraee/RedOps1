import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task } from '../../types/models';
import { taskApi } from '../../services/api';

interface TaskState {
    tasks: Task[];
    currentTask: Task | null;
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async () => {
        const response = await taskApi.getAll();
        return response.data;
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await taskApi.create(task);
        return response.data;
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, task }: { id: string; task: Partial<Task> }) => {
        const response = await taskApi.update(id, task);
        return response.data;
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id: string) => {
        await taskApi.delete(id);
        return id;
    }
);

export const fetchTasksByOperation = createAsyncThunk(
    'tasks/fetchByOperation',
    async (operationId: string) => {
        const response = await taskApi.getByOperation(operationId);
        return response.data;
    }
);

export const fetchTasksByAssignedUser = createAsyncThunk(
    'tasks/fetchByAssignedUser',
    async (userId: string) => {
        const response = await taskApi.getByAssignedUser(userId);
        return response.data;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            // Create Task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create task';
            })
            // Update Task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update task';
            })
            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete task';
            })
            // Fetch by Operation
            .addCase(fetchTasksByOperation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasksByOperation.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasksByOperation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks by operation';
            })
            // Fetch by Assigned User
            .addCase(fetchTasksByAssignedUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasksByAssignedUser.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasksByAssignedUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks by assigned user';
            });
    },
});

export const { setCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer; 