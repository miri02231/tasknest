import React from 'react';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from '../tasks/TaskCard';
import { Task } from '../../types';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
}

export function KanbanBoard({ onEditTask, onNewTask }: KanbanBoardProps) {
  const { tasks, updateTask, darkMode } = useApp();

  const columns = [
    { 
      id: 'todo', 
      title: 'Për t\'u Bërë', 
      icon: Circle, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    { 
      id: 'in-progress', 
      title: 'Në Progres', 
      icon: Clock, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'completed', 
      title: 'Të Përfunduara', 
      icon: CheckCircle2, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    updateTask(taskId, { status: newStatus as any });
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Kanban Board
        </h2>
        <button
          onClick={onNewTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Detyrë e Re</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 transition-all duration-200`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`${column.bgColor} ${darkMode ? 'bg-opacity-20' : ''} p-2 rounded-lg`}>
                    <column.icon className={`w-4 h-4 ${column.color}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {column.title}
                  </h3>
                  <span className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-xs font-medium`}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-move"
                  >
                    <TaskCard task={task} onEdit={onEditTask} />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className={`${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'} border-2 border-dashed rounded-xl p-8 text-center`}>
                    <column.icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {column.id === 'todo' ? 'Nuk ka detyra të reja' : 
                       column.id === 'in-progress' ? 'Nuk ka detyra në progres' : 
                       'Nuk ka detyra të përfunduara'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}