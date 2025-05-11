export type UserRole = 'admin' | 'team_lead' | 'member';

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export type OperationType = 'red_team' | 'pen_test' | 'vulnerability_assessment';

export type OperationPhase = 
    | 'reconnaissance'
    | 'initial_access'
    | 'execution'
    | 'persistence'
    | 'privilege_escalation'
    | 'defense_evasion'
    | 'credential_access'
    | 'discovery'
    | 'lateral_movement'
    | 'collection'
    | 'command_and_control'
    | 'exfiltration'
    | 'impact';

export interface Operation {
    id: string;
    name: string;
    type: OperationType;
    description: string;
    scope: string;
    roe: string;
    teamLead: User;
    members: User[];
    currentPhase: OperationPhase;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface Task {
    id: string;
    operationId: string;
    title: string;
    description: string;
    assignedTo: User;
    status: TaskStatus;
    phase: OperationPhase;
    mitreId: string;
    owaspId: string;
    results: string;
    tools: string[];
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export type ToolType = 'reconnaissance' | 'vulnerability' | 'exploitation' | 'post_exploitation';

export interface Tool {
    id: string;
    name: string;
    type: ToolType;
    description: string;
    command: string;
    arguments: Record<string, string>;
    outputFormat: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ToolExecution {
    id: string;
    toolId: string;
    taskId: string;
    command: string;
    arguments: Record<string, string>;
    output: string;
    status: string;
    startTime: string;
    endTime: string;
    createdAt: string;
} 