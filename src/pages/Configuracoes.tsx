import { useState } from 'react';
import { User, Bell, Shield, Database, Palette, Mail, Save, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const sections = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'integrações', label: 'Integrações', icon: Database },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-dark-600'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function Configuracoes() {
  const [activeSection, setActiveSection] = useState('perfil');
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  const [notifs, setNotifs] = useState({
    email_chamados: true,
    email_alertas: true,
    push_criticos: true,
    push_sla: false,
    resumo_diario: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex gap-4 animate-fade-in">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 hidden sm:block">
        <div className="card overflow-hidden">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-brand-500/10 text-brand-500 border-l-2 border-brand-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700/50 border-l-2 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="sm:hidden w-full space-y-4">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === id
                  ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                  : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        {activeSection === 'perfil' && (
          <div className="card p-6 space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white">Informações do Perfil</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.cargo}</p>
                <button className="text-brand-500 text-xs mt-1 hover:underline">Alterar foto</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nome completo', value: user?.nome ?? '', placeholder: 'Seu nome' },
                { label: 'Cargo', value: user?.cargo ?? '', placeholder: 'Seu cargo' },
                { label: 'Email', value: user?.email ?? '', placeholder: 'seu@email.com' },
                { label: 'Departamento', value: 'Tecnologia da Informação', placeholder: 'Departamento' },
              ].map(({ label, value, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <input
                    defaultValue={value}
                    placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSave} className={`btn-primary flex items-center gap-2 text-sm ${saved ? 'bg-emerald-500' : ''}`}>
              <Save className="w-4 h-4" />
              {saved ? 'Salvo!' : 'Salvar alterações'}
            </button>
          </div>
        )}

        {activeSection === 'notificacoes' && (
          <div className="card p-6 space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white">Preferências de Notificação</h3>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4" /> Email
              </p>
              {[
                { key: 'email_chamados', label: 'Novos chamados atribuídos', desc: 'Receba um email quando um chamado for atribuído a você' },
                { key: 'email_alertas', label: 'Alertas de infraestrutura', desc: 'Notificações por email sobre alertas críticos e avisos' },
                { key: 'resumo_diario', label: 'Resumo diário', desc: 'Receba um resumo diário às 8h com o status dos chamados' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <ToggleSwitch
                    enabled={notifs[key as keyof typeof notifs]}
                    onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4" /> Push
              </p>
              {[
                { key: 'push_criticos', label: 'Alertas críticos', desc: 'Notificações push para alertas de nível crítico' },
                { key: 'push_sla', label: 'Violação de SLA', desc: 'Alertas quando um chamado está próximo de violar o SLA' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <ToggleSwitch
                    enabled={notifs[key as keyof typeof notifs]}
                    onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'seguranca' && (
          <div className="card p-6 space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-500" />
              Segurança da Conta
            </h3>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Conta segura</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">2FA ativo · Último acesso: hoje, 08:30</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha atual</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nova senha</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmar nova senha</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <button className="btn-primary text-sm">Atualizar senha</button>
            </div>
          </div>
        )}

        {activeSection === 'aparencia' && (
          <div className="card p-6 space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-500" />
              Aparência
            </h3>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tema</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', icon: Sun, label: 'Claro', active: !isDark },
                  { id: 'dark', icon: Moon, label: 'Escuro', active: isDark },
                  { id: 'system', icon: Monitor, label: 'Sistema', active: false },
                ].map(({ id, icon: Icon, label, active }) => (
                  <button
                    key={id}
                    onClick={() => { if ((id === 'dark' && !isDark) || (id === 'light' && isDark)) toggle(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      active
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`text-sm font-medium ${active ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'}`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Densidade</p>
              <div className="flex gap-2">
                {['Compacto', 'Normal', 'Confortável'].map((d, i) => (
                  <button
                    key={d}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      i === 1
                        ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                        : 'border-gray-200 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'integrações' && (
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-500" />
              Integrações
            </h3>
            {[
              { name: 'Active Directory', desc: 'Sincronização de usuários e grupos', status: true, badge: 'Conectado' },
              { name: 'Microsoft Teams', desc: 'Notificações e alertas no Teams', status: true, badge: 'Conectado' },
              { name: 'Grafana', desc: 'Dashboards de monitoramento', status: false, badge: 'Desconectado' },
              { name: 'Slack', desc: 'Notificações em canais Slack', status: false, badge: 'Desconectado' },
              { name: 'Jira', desc: 'Sincronização de tickets com Jira', status: false, badge: 'Beta' },
            ].map(({ name, desc, status, badge }) => (
              <div key={name} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-700 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={status ? 'badge-success' : 'badge-neutral'}>{badge}</span>
                  <button className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    status
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                  }`}>
                    {status ? 'Desconectar' : 'Conectar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
