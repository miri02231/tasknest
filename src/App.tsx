import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/views/Dashboard';
import { KanbanBoard } from './components/views/KanbanBoard';
import { TaskForm } from './components/tasks/TaskForm';
import { Task } from './types';

function AppContent() {
  const { user, currentView, darkMode } = useApp();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header onNewTask={handleNewTask} />
          
          <main className="flex-1 p-6 overflow-auto">
            {currentView === 'dashboard' ? (
              <Dashboard onEditTask={handleEditTask} />
            ) : (
              <KanbanBoard onEditTask={handleEditTask} onNewTask={handleNewTask} />
            )}
          </main>
        </div>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        task={editingTask}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;