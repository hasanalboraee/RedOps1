import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';
import { API_URL } from '../../config';
import type { Tool } from '../../types/models';

interface ToolsState {
  tools: Tool[];
  loading: boolean;
  error: string | null;
}

const initialState: ToolsState = {
  tools: [],
  loading: false,
  error: null,
};

export const fetchTools = createAsyncThunk(
  'tools/fetchTools',
  async () => {
    const response = await axiosInstance.get(`${API_URL}/tools`);
    return response.data.map((tool: any): Tool => ({
      ...tool,
      outputFormat: tool.outputFormat || 'text',
      isActive: tool.isActive ?? true,
      createdAt: tool.createdAt || new Date().toISOString(),
      updatedAt: tool.updatedAt || new Date().toISOString(),
    }));
  }
);

export const executeTool = createAsyncThunk(
  'tools/executeTool',
  async ({ toolId, args }: { toolId: string; args: string[] }) => {
    const response = await axiosInstance.post(`${API_URL}/tools/${toolId}/execute`, { args });
    return response.data;
  }
);

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default toolsSlice.reducer; 