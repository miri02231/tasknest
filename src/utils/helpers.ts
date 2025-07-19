import { Task } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const isDueToday = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  return today.toDateString() === due.toDateString();
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const inProgress = tasks.filter(task => task.status === 'in-progress').length;
  const pending = tasks.filter(task => task.status === 'todo').length;
  const overdue = tasks.filter(task => 
    task.dueDate && task.status !== 'completed' && isOverdue(task.dueDate)
  ).length;

  return { total, completed, inProgress, pending, overdue };
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'in-progress': return 'text-blue-600 bg-blue-50';
    case 'todo': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};