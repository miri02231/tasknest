import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Plus, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Briefcase,
  User,
  Heart,
  BookOpen,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  User,
  Heart,
  BookOpen,
  Star
};

export function Sidebar() {
  const { currentView, setView, categories, darkMode, toggleDarkMode, logout, tasks } = useApp();

  const getCategoryTaskCount = (categoryName: string) => {
    return tasks.filter(task => task.category === categoryName && task.status !== 'completed').length;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} w-64 h-screen border-r flex flex-col transition-colors duration-200`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          TaskNest
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Menaxhim detyrave
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              currentView === 'dashboard'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setView('kanban')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              currentView === 'kanban'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
            }`}
          >
            <Kanban className="w-5 h-5" />
            <span className="font-medium">Kanban</span>
          </button>
        </nav>

        {/* Categories */}
        <div className="mt-8">
          <div className={`flex items-center justify-between mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Kategoritë</h3>
            <button className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-800' : ''}`}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Star;
              const taskCount = getCategoryTaskCount(category.name);
              
              return (
                <div
                  key={category.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <IconComponent className="w-4 h-4" style={{ color: category.color }} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {category.name}
                    </span>
                  </div>
                  {taskCount > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {taskCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Cilësimet</span>
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Dil</span>
        </button>
      </div>
    </div>
  );
}