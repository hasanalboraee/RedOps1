export interface Task {
  id: string;
  title: string;
  description: string;
  phase: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  manualResults?: string;
  automaticResults?: string;
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  description: string;
  command: string;
  arguments: string[];
  phase: string;
} 