import React from 'react';
import { Link } from 'react-router';
import { Activity, Shield, Stethoscope, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xl">
            <Activity className="h-6 w-6" />
            <span>AJUDA VETERINÁRIA</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-slate-600 font-medium hover:text-teal-700 transition">Entrar</Link>
            <Link to="/solicitar-acesso" className="px-4 py-2 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition">Solicitar acesso</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-teal-900 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">AJUDA VETERINÁRIA</h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-2xl mx-auto">
              Inteligência Artificial para apoio à decisão clínica veterinária.
            </p>
            <p className="text-lg text-teal-200 max-w-3xl mx-auto leading-relaxed">
              Analise casos clínicos, consulte referências veterinárias, organize prontuários, revise tratamentos e obtenha apoio inteligente para sua tomada de decisão.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/solicitar-acesso" className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium bg-white text-teal-900 rounded-lg hover:bg-teal-50 transition">
                Começar agora <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-12 p-4 bg-teal-950/50 rounded-lg border border-teal-800/50 max-w-3xl mx-auto text-sm text-teal-300">
              <span className="font-semibold text-white">AVISO IMPORTANTE:</span> Sistema destinado exclusivamente ao uso profissional por Médicos-Veterinários. As informações fornecidas são ferramentas de apoio à decisão clínica e não substituem a avaliação, o julgamento e a responsabilidade do Médico-Veterinário.
            </div>
          </div>
        </section>

        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="h-12 w-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Apoio Diagnóstico</h3>
              <p className="text-slate-600">IA treinada em literatura de alto nível para sugerir diagnósticos diferenciais e próximos passos com base na anamnese e exames.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="h-12 w-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Segurança Prescritiva</h3>
              <p className="text-slate-600">Cálculo automático de doses, verificação de interações medicamentosas e alertas de contraindicação.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="h-12 w-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Prontuário Seguro</h3>
              <p className="text-slate-600">Seus dados e de seus pacientes armazenados com máxima segurança, privacidade e isolamento total (LGPD).</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center">
        <p>© 2026 Ajuda Veterinária. Desenvolvido para uso exclusivo de Médicos-Veterinários.</p>
      </footer>
    </div>
  );
}
