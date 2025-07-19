import React from 'react';
import { Calendar, Flag, MoreHorizontal, CheckCircle2, Circle, Edit, Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { formatDate, isOverdue, isDueToday, getPriorityColor, getStatusColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { updateTask, deleteTask, darkMode, categories } = useApp();
  
  const category = categories.find(c => c.name === task.category);
  const isTaskOverdue = task.dueDate && task.status !== 'completed' && isOverdue(task.dueDate);
  const isTaskDueToday = task.dueDate && isDueToday(task.dueDate);

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Jeni të sigurt që dëshironi ta fshini këtë detyrë?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleStatusToggle}
            className="mt-0.5 transition-colors duration-200"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} hover:text-blue-500`} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through opacity-60' : ''} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          >
            <Edit className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <button className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
            <MoreHorizontal className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Priority */}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)} ${darkMode ? 'bg-opacity-20' : ''}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {task.priority === 'high' ? 'Lartë' : task.priority === 'medium' ? 'Mesatar' : 'Ulët'}
          </span>

          {/* Category */}
          {category && (
            <div className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs ${
            isTaskOverdue 
              ? 'text-red-500' 
              : isTaskDueToday 
                ? 'text-orange-500' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}