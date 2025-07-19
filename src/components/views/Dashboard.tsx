import React from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, Flag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from '../tasks/TaskCard';
import { getTaskStats, isOverdue, isDueToday } from '../../utils/helpers';
import { Task } from '../../types';

interface DashboardProps {
  onEditTask: (task: Task) => void;
}

export function Dashboard({ onEditTask }: DashboardProps) {
  const { tasks, darkMode } = useApp();
  const stats = getTaskStats(tasks);

  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const recentTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const statCards = [
    {
      title: 'Detyra Totale',
      value: stats.total,
      icon: TrendingUp,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Të Përfunduara',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Në Progres',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Të Vonuara',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} ${darkMode ? 'bg-opacity-20' : ''} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Detyrat e Fundit
            </h3>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEditTask} />
                ))
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nuk ka detyra aktive</p>
                  <p className="text-sm mt-1">Shtoni një detyrë të re për të filluar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Afatet e Ardhshme
            </h3>
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const isTaskOverdue = isOverdue(task.dueDate!);
                  const isTaskDueToday = isDueToday(task.dueDate!);
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                        darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => onEditTask(task)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'high' 
                            ? 'text-red-600 bg-red-50' 
                            : task.priority === 'medium' 
                              ? 'text-yellow-600 bg-yellow-50'
                              : 'text-green-600 bg-green-50'
                        } ${darkMode ? 'bg-opacity-20' : ''}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {task.priority === 'high' ? 'Lartë' : task.priority === 'medium' ? 'Mesatar' : 'Ulët'}
                        </span>
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${
                        isTaskOverdue 
                          ? 'text-red-500' 
                          : isTaskDueToday 
                            ? 'text-orange-500' 
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        <span>
                          {isTaskOverdue ? 'E vonuar' : isTaskDueToday ? 'Sot' : new Date(task.dueDate!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nuk ka afate të ardhshme</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}