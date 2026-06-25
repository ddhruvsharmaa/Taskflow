import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, Task, Project } from '../types';

const defaultProjects: Project[] = [
  { id: 'p1', name: 'Product Engineering', color: '#3B82F6' },
  { id: 'p2', name: 'Design System', color: '#8B5CF6' },
  { id: 'p3', name: 'Marketing', color: '#10B981' }
];

const defaultTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement Dark Mode aesthetics',
    status: 'Done',
    priority: 'High',
    tags: ['Design', 'UI'],
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    projectId: 'p2'
  },
  {
    id: 't2',
    title: 'Integrate Gemini API for Natural Language processing',
    status: 'In Progress',
    priority: 'High',
    tags: ['AI', 'Backend'],
    dueDate: new Date().toISOString(), // Changed to today to trigger notification
    hasNotification: true,
    createdAt: new Date().toISOString(),
    projectId: 'p1'
  },
  {
    id: 't3',
    title: 'Draft Q3 marketing copy',
    status: 'Todo',
    priority: 'Medium',
    tags: ['Content'],
    dueDate: null,
    createdAt: new Date().toISOString(),
    projectId: 'p3'
  }
];

const initialState: AppState = {
  tasks: defaultTasks,
  projects: defaultProjects,
  currentView: 'List',
  searchQuery: ''
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t))
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, status: action.payload.status } : t
        )
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('taskflow_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('taskflow_state', JSON.stringify(state));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}
