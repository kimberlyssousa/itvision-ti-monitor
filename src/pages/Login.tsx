import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Wifi, Server, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('admin@itvision.com.br');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex overflow-hidden relative">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(11,114,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(11,114,212,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-400/8 rounded-full blur-3xl pointer-events-none" />

      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">IT Vision</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Gestão de TI<br />
            <span className="text-brand-400">inteligente</span> e<br />
            centralizada.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Monitore sua infraestrutura, gerencie chamados e tome decisões baseadas em dados em tempo real.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Server, label: 'Monitoramento de Infraestrutura', desc: 'Servidores, switches, roteadores e mais' },
              { icon: Shield, label: 'Gestão de Chamados com SLA', desc: 'Controle total de tickets e prazos' },
              { icon: Wifi, label: 'Visibilidade de Rede', desc: 'Topologia e status em tempo real' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-9 h-9 bg-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-500 text-sm">
          <span>© 2026 IT Vision</span>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">IT Vision</span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo de volta</h2>
              <p className="text-gray-400 text-sm">Entre com suas credenciais para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email corporativo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@empresa.com.br"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-300">Senha</label>
                  <button type="button" className="text-brand-400 text-xs hover:text-brand-300 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 text-red-400 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar no sistema'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-center text-gray-500 text-xs">
                Protegido por autenticação de dois fatores
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 text-xs">Conexão segura SSL/TLS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 px-1">
            <p className="text-gray-600 text-xs">© 2026 IT Vision Platform</p>
            <button
              onClick={toggle}
              className="text-gray-500 hover:text-gray-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              {isDark ? '☀ Modo claro' : '☾ Modo escuro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
