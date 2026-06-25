export type ID = string;

export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  dueDate: string | null; // ISO Date String
  hasNotification?: boolean;
  createdAt: string;
  projectId?: ID;
}

export interface Project {
  id: ID;
  name: string;
  color: string;
}

export type ViewType = 'List' | 'Board' | 'Dashboard';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  currentView: ViewType;
  searchQuery: string;
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: ID }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'MOVE_TASK'; payload: { id: ID; status: TaskStatus } }
  | { type: 'LOAD_STATE'; payload: AppState };
