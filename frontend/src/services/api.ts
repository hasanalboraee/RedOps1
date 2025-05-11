import axios from 'axios';
import type { User, Operation, Task, Tool } from '../types/models';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// User API
export const userApi = {
    create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
        api.post<User>('/users', user),
    getAll: () => api.get<User[]>('/users'),
    getById: (id: string) => api.get<User>(`/users/${id}`),
    update: (id: string, user: Partial<User>) => 
        api.put<User>(`/users/${id}`, user),
    delete: (id: string) => api.delete(`/users/${id}`),
    getByEmail: (email: string) => api.get<User>(`/users/email/${email}`),
};

// Operation API
export const operationApi = {
    create: (operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) => 
        api.post<Operation>('/operations', operation),
    getAll: () => api.get<Operation[]>('/operations'),
    getById: (id: string) => api.get<Operation>(`/operations/${id}`),
    update: (id: string, operation: Partial<Operation>) => 
        api.put<Operation>(`/operations/${id}`, operation),
    delete: (id: string) => api.delete(`/operations/${id}`),
    getByTeamMember: (userId: string) => 
        api.get<Operation[]>(`/operations/user/${userId}`),
    updatePhase: (id: string, phase: Operation['currentPhase']) => 
        api.put(`/operations/${id}/phase`, { phase }),
};

// Task API
export const taskApi = {
    create: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => 
        api.post<Task>('/tasks', task),
    getAll: () => api.get<Task[]>('/tasks'),
    getById: (id: string) => api.get<Task>(`/tasks/${id}`),
    update: (id: string, task: Partial<Task>) => 
        api.put<Task>(`/tasks/${id}`, task),
    delete: (id: string) => api.delete(`/tasks/${id}`),
    getByOperation: (operationId: string) => 
        api.get<Task[]>(`/tasks/operation/${operationId}`),
    getByAssignedUser: (userId: string) => 
        api.get<Task[]>(`/tasks/user/${userId}`),
    updateStatus: (id: string, status: Task['status']) => 
        api.put(`/tasks/${id}/status`, { status }),
    updateResults: (id: string, results: string) => 
        api.put(`/tasks/${id}/results`, { results }),
};

// Tool API
export const toolApi = {
    create: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => 
        api.post<Tool>('/tools', tool),
    getAll: () => api.get<Tool[]>('/tools'),
    getById: (id: string) => api.get<Tool>(`/tools/${id}`),
    update: (id: string, tool: Partial<Tool>) => 
        api.put<Tool>(`/tools/${id}`, tool),
    delete: (id: string) => api.delete(`/tools/${id}`),
    getByType: (type: Tool['type']) => 
        api.get<Tool[]>(`/tools/type/${type}`),
    getActive: () => api.get<Tool[]>('/tools/active'),
    updateStatus: (id: string, isActive: boolean) => 
        api.put(`/tools/${id}/status`, { isActive }),
}; 