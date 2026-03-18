import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  CalendarDays,
  CalendarClock,
  BookOpen,
  ClipboardList,
  Timer,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { to: '/periodos', label: 'Periodos', icon: Timer },
  { to: '/materias', label: 'Materias', icon: BookOpen },
  { to: '/tareas', label: 'Tareas', icon: ClipboardList },
  { to: '/horarios', label: 'Horarios', icon: CalendarClock },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen gradient-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg tracking-tight">Scholar</h1>
              <p className="text-white/40 text-xs">Academic Manager</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-lg shadow-purple-500/10'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t border-white/6">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.nombre}</p>
                <p className="text-white/40 text-xs truncate">{user?.correo}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 glass border-b border-white/6 flex items-center px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all mr-4"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <p className="text-white/40 text-sm">
            Bienvenido, <span className="text-white/70 font-medium">{user?.nombre}</span>
          </p>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
