export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  categories: Category[];
  currentView: 'dashboard' | 'kanban';
  darkMode: boolean;
}

export type ViewType = 'dashboard' | 'kanban';