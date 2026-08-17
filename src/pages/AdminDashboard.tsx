import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/users', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUsersList(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const submitApprove = async () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    
    if (!approvingUserId) return;

    try {
      await fetch(`/api/admin/users/${approvingUserId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      // reload list
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      setUsersList(await res.json());
      setApprovingUserId(null);
      setNewPassword('');
      setPasswordError('');
    } catch (err) {
      console.error(err);
      setPasswordError('Erro ao aprovar usuário.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CRMV/Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {usersList.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.crmv} - {u.state}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    u.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {u.status === 'PENDENTE' && (
                    <button onClick={() => setApprovingUserId(u.id)} className="text-teal-600 hover:text-teal-900 font-bold bg-teal-50 px-3 py-1 rounded">
                      Aprovar Acesso
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {approvingUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Definir Senha Inicial</h2>
            <p className="text-sm text-slate-600 mb-4">
              Defina uma senha de no mínimo 8 caracteres para liberar o acesso deste médico-veterinário.
            </p>
            
            {passwordError && (
              <div className="bg-red-50 text-red-700 p-2 text-sm rounded mb-4">
                {passwordError}
              </div>
            )}
            
            <input 
              type="text" 
              placeholder="Digite a senha (mín. 8 chars)" 
              className="w-full p-2 border border-slate-300 rounded mb-4 focus:ring-2 focus:ring-teal-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setApprovingUserId(null); setPasswordError(''); setNewPassword(''); }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={submitApprove}
                className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
              >
                Confirmar e Aprovar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
