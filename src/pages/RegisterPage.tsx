import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Activity } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', crmv: '', state: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Activity className="h-12 w-12 text-teal-700 mx-auto" />
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Solicitação enviada!</h2>
          <p className="mt-4 text-slate-600">Sua solicitação foi registrada. Aguarde a aprovação do administrador para receber os dados de acesso no seu e-mail.</p>
          <Link to="/" className="mt-6 inline-block text-teal-700 font-medium">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-teal-700">
          <Activity className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Solicitar Acesso
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Apenas para Médicos-Veterinários. Já tem conta?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Entrar
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
              <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">CRMV</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" value={formData.crmv} onChange={e => setFormData({...formData, crmv: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Estado</label>
                <input type="text" required maxLength={2} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input type="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Telefone (Celular)</label>
              <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-teal-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Solicitar Acesso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
