import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Operation } from '../../types/models';
import { operationApi } from '../../services/api';

interface OperationState {
    operations: Operation[];
    currentOperation: Operation | null;
    loading: boolean;
    error: string | null;
}

const initialState: OperationState = {
    operations: [],
    currentOperation: null,
    loading: false,
    error: null,
};

export const fetchOperations = createAsyncThunk(
    'operations/fetchAll',
    async () => {
        const response = await operationApi.getAll();
        return response.data;
    }
);

export const createOperation = createAsyncThunk(
    'operations/create',
    async (operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await operationApi.create(operation);
        return response.data;
    }
);

export const updateOperation = createAsyncThunk(
    'operations/update',
    async ({ id, operation }: { id: string; operation: Partial<Operation> }) => {
        const response = await operationApi.update(id, operation);
        return response.data;
    }
);

export const deleteOperation = createAsyncThunk(
    'operations/delete',
    async (id: string) => {
        await operationApi.delete(id);
        return id;
    }
);

export const fetchOperationsByTeamMember = createAsyncThunk(
    'operations/fetchByTeamMember',
    async (memberId: string) => {
        const response = await operationApi.getByTeamMember(memberId);
        return response.data;
    }
);

export const fetchOperationsByPhase = createAsyncThunk(
    'operations/fetchByPhase',
    async (phase: Operation['currentPhase']) => {
        const response = await operationApi.getByPhase(phase);
        return response.data;
    }
);

const operationSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        setCurrentOperation: (state, action) => {
            state.currentOperation = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Operations
            .addCase(fetchOperations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOperations.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = action.payload;
            })
            .addCase(fetchOperations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operations';
            })
            // Create Operation
            .addCase(createOperation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOperation.fulfilled, (state, action) => {
                state.loading = false;
                state.operations.push(action.payload);
            })
            .addCase(createOperation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create operation';
            })
            // Update Operation
            .addCase(updateOperation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOperation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.operations.findIndex(op => op.id === action.payload.id);
                if (index !== -1) {
                    state.operations[index] = action.payload;
                }
            })
            .addCase(updateOperation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update operation';
            })
            // Delete Operation
            .addCase(deleteOperation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOperation.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = state.operations.filter(op => op.id !== action.payload);
            })
            .addCase(deleteOperation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete operation';
            })
            // Fetch by Team Member
            .addCase(fetchOperationsByTeamMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOperationsByTeamMember.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = action.payload;
            })
            .addCase(fetchOperationsByTeamMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operations by team member';
            })
            // Fetch by Phase
            .addCase(fetchOperationsByPhase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOperationsByPhase.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = action.payload;
            })
            .addCase(fetchOperationsByPhase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operations by phase';
            });
    },
});

export const { setCurrentOperation, clearError } = operationSlice.actions;
export default operationSlice.reducer; 