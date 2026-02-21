import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/investments', label: 'Investments', icon: '💼' },
    { path: '/lifestyle-basket', label: 'Lifestyle Basket', icon: '🛒' },
    { path: '/anti-portfolio', label: 'Anti-Portfolio', icon: '🚫' },
    { path: '/scenario-branching', label: 'Scenarios', icon: '🌳' },
    { path: '/goal-tracker', label: 'Goal Tracker', icon: '🎯' },
    { path: '/calculators', label: 'Calculators', icon: '🧮' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`bg-secondary text-white transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } flex flex-col`}
      >
        {/* Logo - UPDATED WITH GRADIENT BOX */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                {/* Gradient M Box with Glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal-600 rounded-xl blur opacity-75"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                </div>
                {/* App Name */}
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  myfynzo
                </h1>
              </div>
            ) : (
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                  isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={collapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`${collapsed ? 'text-center' : ''}`}>
            {!collapsed && (
              <div className="text-sm text-white/60 mb-2 truncate">
                {user?.email}
              </div>
            )}
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-colors font-semibold"
            >
              {collapsed ? '🚪' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
