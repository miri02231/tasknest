import { Task, User, Category } from '../types';

const STORAGE_KEYS = {
  TASKS: 'tasknest_tasks',
  USER: 'tasknest_user',
  CATEGORIES: 'tasknest_categories',
  DARK_MODE: 'tasknest_dark_mode',
  VIEW: 'tasknest_view'
};

export const storage = {
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  setTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getCategories: (): Category[] => {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  },

  setCategories: (categories: Category[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getDarkMode: (): boolean => {
    const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return darkMode ? JSON.parse(darkMode) : false;
  },

  setDarkMode: (darkMode: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  },

  getView: (): 'dashboard' | 'kanban' => {
    const view = localStorage.getItem(STORAGE_KEYS.VIEW);
    return (view as 'dashboard' | 'kanban') || 'dashboard';
  },

  setView: (view: 'dashboard' | 'kanban'): void => {
    localStorage.setItem(STORAGE_KEYS.VIEW, view);
  }
};