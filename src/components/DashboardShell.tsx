
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  roleName: string;
  userName: string;
  userAvatar?: string;
}

export default function DashboardShell({
  children,
  sidebarItems,
  activeTab,
  onTabChange,
  roleName,
  userName,
  userAvatar = "https://picsum.photos/seed/user/100/100"
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[95] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-[100] transition-all duration-300 overflow-x-hidden flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-red-primary rounded-full shrink-0" />
            <h1 className={`text-2xl font-display font-bold text-gray-900 tracking-tight transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'lg:opacity-100 lg:w-auto'}`}>
              UniGuild
            </h1>
          </div>
          <button 
            onClick={() => isSidebarOpen ? setIsSidebarOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-primary transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1 flex-1 overflow-y-auto pb-4">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all group
                ${activeTab === item.id 
                  ? 'bg-red-primary text-white shadow-lg shadow-red-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-red-primary'}
                ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <span className="w-5 flex justify-center shrink-0">{item.icon}</span>
              <span className={`font-bold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'lg:opacity-100 lg:w-auto'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={() => navigate('/login')}
            className={`
              flex items-center gap-3 py-3 px-4 text-gray-500 font-bold rounded-xl hover:bg-red-50 hover:text-red-primary transition-all w-full
              ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
            `}
          >
            <X size={18} className="shrink-0" />
            <span className={`font-bold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'lg:opacity-100 lg:w-auto'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-[90] bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-2 border border-gray-100 focus-within:border-red-primary focus-within:bg-white transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{userName}</p>
                <p className="text-[10px] font-medium text-red-primary uppercase tracking-wider">{roleName}</p>
              </div>
              <img 
                src={userAvatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-red-primary p-0.5"
              />
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
