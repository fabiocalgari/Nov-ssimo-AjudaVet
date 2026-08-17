import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FileText, Plus, Users, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/consultations', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setConsultations(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-100 font-sans text-slate-800 overflow-y-auto">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg text-slate-800">Meu Consultório</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/nova-consulta" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Novo Atendimento
          </Link>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Meus Pacientes</p>
              <p className="text-2xl font-bold text-slate-800">--</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Prontuários Salvos</p>
              <p className="text-2xl font-bold text-slate-800">{consultations.length}</p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">Últimos Atendimentos</h2>
          
          {consultations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Nenhum atendimento registrado ainda.</p>
              <p className="text-sm mt-1">Inicie um novo atendimento para utilizar a IA.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consultations.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-teal-200 hover:bg-teal-50/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Atendimento</span>
                      <span className="text-sm font-bold text-slate-800">#{c.id.substring(0,8)}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')} às {new Date(c.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition shrink-0">
                    Ver Prontuário
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
