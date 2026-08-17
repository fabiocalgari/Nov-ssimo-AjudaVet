import React, { useState } from 'react';
import { Activity, Upload, Stethoscope, FileText, Zap } from 'lucide-react';

export default function NewConsultation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tutorName: '', tutorPhone: '', tutorEmail: '',
    petName: '', species: 'Cão', sex: 'Fêmea', reproductiveStatus: 'Inteiro',
    weight: '', breed: '', age: '',
    anamnesis: '', physicalExam: ''
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [consultId, setConsultId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      let res = await fetch('/api/clients', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.tutorName, phone: formData.tutorPhone, email: formData.tutorEmail })
      });
      const client = await res.json();

      res = await fetch('/api/pets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id, name: formData.petName, species: formData.species,
          sex: formData.sex, reproductiveStatus: formData.reproductiveStatus,
          weight: formData.weight, breed: formData.breed
        })
      });
      const pet = await res.json();

      res = await fetch('/api/consultations', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId: pet.id, anamnesis: formData.anamnesis, physicalExam: formData.physicalExam })
      });
      const consult = await res.json();
      setConsultId(consult.id);

      if (files && files.length > 0) {
        const formDataFiles = new FormData();
        Array.from(files).forEach(f => formDataFiles.append('files', f));
        await fetch(`/api/consultations/${consult.id}/exams`, {
          method: 'POST',
          body: formDataFiles
        });
      }

      res = await fetch('/api/ai/analyze', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId: pet.id, anamnesis: formData.anamnesis, physicalExam: formData.physicalExam, consultId: consult.id })
      });
      const analysisData = await res.json();
      setAiAnalysis(analysisData.analysis);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Erro ao analisar o caso.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg text-slate-800">Novo Atendimento</h1>
          <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-200">EM ANDAMENTO</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-sm italic">
          <span>{consultId ? `ID: #${consultId.substring(0,8)}` : 'Preenchendo Formulário'}</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-hidden">
        
        <div className={`col-span-12 ${step === 3 ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col gap-6 overflow-y-auto pr-2`}>
          
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400">Dados do Paciente & Tutor</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Nome do Tutor</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.tutorName} onChange={e => setFormData({...formData, tutorName: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Telefone</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.tutorPhone} onChange={e => setFormData({...formData, tutorPhone: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">E-mail</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.tutorEmail} onChange={e => setFormData({...formData, tutorEmail: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Nome do Animal</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.petName} onChange={e => setFormData({...formData, petName: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Espécie</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})}>
                  <option>Cão</option><option>Gato</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Raça</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Peso (kg)</label>
                <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Sexo</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
                  <option>Fêmea</option><option>Macho</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Status Reprodutivo</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none" value={formData.reproductiveStatus} onChange={e => setFormData({...formData, reproductiveStatus: e.target.value})}>
                  <option>Inteiro</option><option>Castrado/Esterilizado</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col shrink-0">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Anamnese & Histórico Clínico</h2>
            <textarea 
              className="w-full h-32 bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/20 mb-4" 
              placeholder="Descreva a queixa principal, evolução dos sinais, alimentação e medicamentos utilizados..."
              value={formData.anamnesis} 
              onChange={e => setFormData({...formData, anamnesis: e.target.value})}
            />
            
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Exame Físico (Opcional)</h2>
            <textarea 
              className="w-full h-24 bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/20 mb-6" 
              placeholder="Temperatura, FC, FR, mucosas, hidratação..."
              value={formData.physicalExam} 
              onChange={e => setFormData({...formData, physicalExam: e.target.value})}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4" /> Anexar Exames
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.txt" className="hidden" onChange={e => setFiles(e.target.files)} />
              </label>
              {files && files.length > 0 && <span className="flex items-center text-sm text-slate-500">{files.length} arquivo(s) selecionado(s)</span>}
              
              <button 
                onClick={handleAnalyze} 
                disabled={analyzing} 
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                {analyzing ? <Activity className="animate-spin h-5 w-5" /> : <Zap className="h-5 w-5" />}
                {analyzing ? 'ANALISANDO DADOS CLÍNICOS...' : 'ANALISAR CASO COM IA'}
              </button>
            </div>
          </section>
        </div>

        {step === 3 && (
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 overflow-hidden h-full">
            <div className="bg-white rounded-2xl flex flex-col border border-slate-200 shadow-xl overflow-hidden h-full">
              <div className="bg-teal-800 p-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-teal-400 rounded-full animate-pulse flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-800" />
                  </div>
                  <span className="font-bold text-sm">ASSISTENTE CLÍNICO VETERINÁRIO</span>
                </div>
                <span className="text-[10px] bg-teal-700 px-2 py-1 rounded">IA ATIVA</span>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto bg-slate-50 prose prose-sm prose-teal max-w-none text-slate-700">
                 {/* The AI analysis text often contains markdown, so formatting as pre-wrap for now, but a real markdown parser would be better. */}
                 <div className="whitespace-pre-wrap leading-relaxed">{aiAnalysis}</div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-2 shrink-0">
                <div className="flex gap-2">
                  <button onClick={() => window.location.href='/dashboard'} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors">
                    SALVAR PRONTUÁRIO
                  </button>
                  <button className="flex-1 py-3 border border-slate-300 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 transition-colors">
                    GERAR RECEITA
                  </button>
                </div>
                <p className="text-[8px] text-center text-slate-400 px-4 mt-2">A análise da IA é uma ferramenta de apoio e não substitui o julgamento profissional do Médico-Veterinário.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
