import axiosInstance from './axiosConfig';
import type { User, Operation, Task, Tool } from '../types/models';

// User API
export const userApi = {
    create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
        axiosInstance.post<User>('/users', user),
    getAll: () => axiosInstance.get<User[]>('/users'),
    getById: (id: string) => axiosInstance.get<User>(`/users/${id}`),
    update: (id: string, user: Partial<User>) => 
        axiosInstance.put<User>(`/users/${id}`, user),
    delete: (id: string) => axiosInstance.delete(`/users/${id}`),
    getByEmail: (email: string) => axiosInstance.get<User>(`/users/email/${email}`),
};

// Operation API
export const operationApi = {
    create: (operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) => 
        axiosInstance.post<Operation>('/operations', operation),
    getAll: () => axiosInstance.get<Operation[]>('/operations'),
    getById: (id: string) => axiosInstance.get<Operation>(`/operations/${id}`),
    update: (id: string, operation: Partial<Operation>) => 
        axiosInstance.put<Operation>(`/operations/${id}`, operation),
    delete: (id: string) => axiosInstance.delete(`/operations/${id}`),
    getByTeamMember: (userId: string) => 
        axiosInstance.get<Operation[]>(`/operations/user/${userId}`),
    updatePhase: (id: string, phase: Operation['currentPhase']) => 
        axiosInstance.put(`/operations/${id}/phase`, { phase }),
};

// Task API
export const taskApi = {
    create: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => 
        axiosInstance.post<Task>('/tasks', task),
    getAll: () => axiosInstance.get<Task[]>('/tasks'),
    getById: (id: string) => axiosInstance.get<Task>(`/tasks/${id}`),
    update: (id: string, task: Partial<Task>) => 
        axiosInstance.put<Task>(`/tasks/${id}`, task),
    delete: (id: string) => axiosInstance.delete(`/tasks/${id}`),
    getByOperation: (operationId: string) => 
        axiosInstance.get<Task[]>(`/operations/${operationId}/tasks`),
    getByAssignedUser: (userId: string) => 
        axiosInstance.get<Task[]>(`/tasks/user/${userId}`),
    updateStatus: (id: string, status: Task['status']) => 
        axiosInstance.put(`/tasks/${id}/status`, { status }),
    updateResults: (id: string, results: string) => 
        axiosInstance.put(`/tasks/${id}/results`, { results }),
};

// Tool API
export const toolApi = {
    create: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => 
        axiosInstance.post<Tool>('/tools', tool),
    getAll: () => axiosInstance.get<Tool[]>('/tools'),
    getById: (id: string) => axiosInstance.get<Tool>(`/tools/${id}`),
    update: (id: string, tool: Partial<Tool>) => 
        axiosInstance.put<Tool>(`/tools/${id}`, tool),
    delete: (id: string) => axiosInstance.delete(`/tools/${id}`),
    getByType: (type: Tool['type']) => 
        axiosInstance.get<Tool[]>(`/tools/type/${type}`),
    getActive: () => axiosInstance.get<Tool[]>('/tools/active'),
    updateStatus: (id: string, isActive: boolean) => 
        axiosInstance.put(`/tools/${id}/status`, { isActive }),
}; 