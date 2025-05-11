import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Tool, ToolExecution } from '../../types/models';
import { toolApi } from '../../services/api';

interface ToolState {
    tools: Tool[];
    currentTool: Tool | null;
    executions: ToolExecution[];
    loading: boolean;
    error: string | null;
}

const initialState: ToolState = {
    tools: [],
    currentTool: null,
    executions: [],
    loading: false,
    error: null,
};

export const fetchTools = createAsyncThunk(
    'tools/fetchAll',
    async () => {
        const response = await toolApi.getAll();
        return response.data;
    }
);

export const createTool = createAsyncThunk(
    'tools/create',
    async (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await toolApi.create(tool);
        return response.data;
    }
);

export const updateTool = createAsyncThunk(
    'tools/update',
    async ({ id, tool }: { id: string; tool: Partial<Tool> }) => {
        const response = await toolApi.update(id, tool);
        return response.data;
    }
);

export const deleteTool = createAsyncThunk(
    'tools/delete',
    async (id: string) => {
        await toolApi.delete(id);
        return id;
    }
);

export const fetchToolsByType = createAsyncThunk(
    'tools/fetchByType',
    async (type: Tool['type']) => {
        const response = await toolApi.getByType(type);
        return response.data;
    }
);

export const fetchActiveTools = createAsyncThunk(
    'tools/fetchActive',
    async () => {
        const response = await toolApi.getActive();
        return response.data;
    }
);

export const executeTool = createAsyncThunk(
    'tools/execute',
    async ({ toolId, taskId, arguments: args }: { toolId: string; taskId: string; arguments: string[] }) => {
        const response = await toolApi.execute(toolId, taskId, args);
        return response.data;
    }
);

const toolSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setCurrentTool: (state, action) => {
            state.currentTool = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tools
            .addCase(fetchTools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTools.fulfilled, (state, action) => {
                state.loading = false;
                state.tools = action.payload;
            })
            .addCase(fetchTools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tools';
            })
            // Create Tool
            .addCase(createTool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTool.fulfilled, (state, action) => {
                state.loading = false;
                state.tools.push(action.payload);
            })
            .addCase(createTool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create tool';
            })
            // Update Tool
            .addCase(updateTool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTool.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tools.findIndex(tool => tool.id === action.payload.id);
                if (index !== -1) {
                    state.tools[index] = action.payload;
                }
            })
            .addCase(updateTool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update tool';
            })
            // Delete Tool
            .addCase(deleteTool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTool.fulfilled, (state, action) => {
                state.loading = false;
                state.tools = state.tools.filter(tool => tool.id !== action.payload);
            })
            .addCase(deleteTool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete tool';
            })
            // Fetch by Type
            .addCase(fetchToolsByType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchToolsByType.fulfilled, (state, action) => {
                state.loading = false;
                state.tools = action.payload;
            })
            .addCase(fetchToolsByType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tools by type';
            })
            // Fetch Active Tools
            .addCase(fetchActiveTools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveTools.fulfilled, (state, action) => {
                state.loading = false;
                state.tools = action.payload;
            })
            .addCase(fetchActiveTools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch active tools';
            })
            // Execute Tool
            .addCase(executeTool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(executeTool.fulfilled, (state, action) => {
                state.loading = false;
                state.executions.push(action.payload);
            })
            .addCase(executeTool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to execute tool';
            });
    },
});

export const { setCurrentTool, clearError } = toolSlice.actions;
export default toolSlice.reducer; 