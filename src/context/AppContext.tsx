import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Task, User, Category, ViewType } from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setView: (view: ViewType) => void;
  toggleDarkMode: () => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category };

const defaultCategories: Category[] = [
  { id: '1', name: 'Punë', color: '#3B82F6', icon: 'Briefcase' },
  { id: '2', name: 'Personal', color: '#10B981', icon: 'User' },
  { id: '3', name: 'Shëndeti', color: '#F59E0B', icon: 'Heart' },
  { id: '4', name: 'Studime', color: '#8B5CF6', icon: 'BookOpen' },
  { id: '5', name: 'Hobbit', color: '#EF4444', icon: 'Star' }
];

const initialState: AppState = {
  user: null,
  tasks: [],
  categories: defaultCategories,
  currentView: 'dashboard',
  darkMode: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        )
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on app start
    const user = storage.getUser();
    const tasks = storage.getTasks();
    const categories = storage.getCategories();
    const darkMode = storage.getDarkMode();
    const view = storage.getView();

    if (user) dispatch({ type: 'SET_USER', payload: user });
    if (tasks.length > 0) dispatch({ type: 'SET_TASKS', payload: tasks });
    if (categories.length > 0) dispatch({ type: 'SET_CATEGORIES', payload: categories });
    else storage.setCategories(defaultCategories);
    if (darkMode) dispatch({ type: 'TOGGLE_DARK_MODE' });
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  useEffect(() => {
    // Save to localStorage when state changes
    storage.setTasks(state.tasks);
    storage.setUser(state.user);
    storage.setCategories(state.categories);
    storage.setDarkMode(state.darkMode);
    storage.setView(state.currentView);
  }, [state.tasks, state.user, state.categories, state.darkMode, state.currentView]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication
    if (email && password) {
      const user: User = {
        id: generateId(),
        name: email.split('@')[0],
        email,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
      };
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_TASKS', payload: [] });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: state.user?.id || 'demo'
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setView = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const category: Category = {
      ...categoryData,
      id: generateId()
    };
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addTask,
        updateTask,
        deleteTask,
        setView,
        toggleDarkMode,
        addCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}