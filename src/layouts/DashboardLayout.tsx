import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard, Plus, Users } from 'lucide-react';

export default function DashboardLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClasses = (path: string) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition cursor-pointer ${
      isActive(path) 
        ? 'bg-teal-600 text-white' 
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">+</div>
            <span className="font-bold text-lg tracking-tight">AJUDA VET</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 opacity-80">Suporte à Decisão Clínica</p>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <Link to="/dashboard" className={linkClasses('/dashboard')}>
            <LayoutDashboard className="h-5 w-5" /> <span className="font-medium text-sm">Meu Consultório</span>
          </Link>
          <Link to="/dashboard/nova-consulta" className={linkClasses('/dashboard/nova-consulta')}>
            <Plus className="h-5 w-5" /> <span className="font-medium text-sm">Novo Atendimento</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold uppercase">
                {user.name.substring(0, 2)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold truncate">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-tighter truncate">{user.email}</span>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-400 hover:text-white transition shrink-0">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
