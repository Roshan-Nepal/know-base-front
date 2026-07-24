import React, { useState } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Settings as SettingsIcon,
  Database,
  Search,
  Plus,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch(e) {}
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Chat', path: '#chat', icon: MessageSquare },
    ...(user?.roles?.includes('ROLE_ADMIN') ? [{ name: 'Admin', path: '#admin', icon: ShieldCheck }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#171717] flex text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#333] z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
            <Database className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Know-Base
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col justify-between transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-6 mb-2">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
              <Database className="h-5 w-5 text-black" />
            </div>
            <h1 className="font-bold text-white tracking-wide m-0">
              Know-Base
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive 
                      ? 'bg-[#003d82] text-white font-medium' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Settings / Actions */}
        <div className="p-3">
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-2 mb-4 rounded-lg text-sm transition-colors
              ${location.pathname === '/settings' 
                ? 'bg-[#003d82] text-white font-medium' 
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]'
              }
            `}
          >
            <SettingsIcon className="h-5 w-5 shrink-0" />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 mb-4 rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] transition-colors text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Log out
          </button>

          <div className="flex items-center gap-3 px-3 py-2 border-t border-[#333] pt-4">
            <div className="h-8 w-8 rounded-full bg-[#003d82] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'JS'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-white truncate leading-tight">
                {user?.username || 'Jordan Shah'}
              </h4>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pt-16 md:pt-0">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-[#333] flex items-center justify-between px-8 shrink-0 bg-white dark:bg-[#171717] transition-colors">
          <div className="flex-1 max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-[#71717a]" />
            </div>
            <input 
              type="text" 
              placeholder="Search documents, ask a question..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-[#222222] border border-transparent focus:border-slate-300 dark:focus:border-[#3f3f46] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-[#71717a] focus:outline-none transition-colors"
            />
          </div>
          <div className="ml-4">
            <Link 
              to="/documents/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-white text-black font-medium border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Upload
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
};
