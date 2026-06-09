import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, RefreshCw, Activity, Wifi, WifiOff, Server } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Asset {
  id: string;
  nome: string;
  tipo: string;
  ip: string;
  mac: string;
  sistema: string;
  localizacao: string;
  responsavel: string;
  status: string;
  cpu_uso: number;
  memoria_uso: number;
  disco_uso: number;
  ultimo_ping: string;
  garantia_ate: string;
}

interface Alerta {
  id: string;
  ativo_id: string;
  tipo: string;
  mensagem: string;
  criado_em: string;
  ativos?: { nome: string };
}

const alertIcons = {
  critico: AlertTriangle,
  aviso: AlertTriangle,
  info: Info,
};

const alertColors = {
  critico: 'text-red-500 bg-red-500/10 border-red-500/20',
  aviso: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

function StatusDot({ status }: { status: string }) {
  const cls = status === 'online'
    ? 'bg-emerald-400 shadow-emerald-400/50'
    : status === 'offline'
    ? 'bg-red-400 shadow-red-400/50'
    : 'bg-amber-400 shadow-amber-400/50';
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full shadow-sm ${cls} ${status === 'online' ? 'animate-pulse' : ''}`} />
  );
}

function MetricGauge({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-dark-700" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function Monitoramento() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    const [{ data: ativos }, { data: alerts }] = await Promise.all([
      supabase.from('ativos').select('*').order('nome'),
      supabase.from('alertas').select('*, ativos(nome)').order('criado_em', { ascending: false }),
    ]);

    const listaAtivos = (ativos as Asset[]) ?? [];
    setAssets(listaAtivos);
    setAlertas((alerts as Alerta[]) ?? []);
    if (listaAtivos.length > 0 && !selectedAsset) {
      const online = listaAtivos.find(a => a.status === 'online');
      setSelectedAsset(online ?? listaAtivos[0]);
    }
    setLoading(false);
  }

  const onlineCount = assets.filter(a => a.status === 'online').length;
  const offlineCount = assets.filter(a => a.status === 'offline').length;
  const criticalAlerts = alertas.filter(a => a.tipo === 'critico').length;

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-gray-400">Carregando monitoramento...</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Ativos Online', value: onlineCount, icon: Wifi, color: 'text-emerald-500 bg-emerald-500/10', detail: 'Respondendo ao ping' },
          { label: 'Ativos Offline', value: offlineCount, icon: WifiOff, color: 'text-red-500 bg-red-500/10', detail: 'Sem resposta' },
          { label: 'Alertas Críticos', value: criticalAlerts, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10', detail: 'Atenção imediata' },
          { label: 'Disponibilidade', value: assets.length > 0 ? `${Math.round((onlineCount / assets.length) * 100)}%` : '0%', icon: Activity, color: 'text-brand-500 bg-brand-500/10', detail: 'Uptime geral' },
        ].map(({ label, value, icon: Icon, color, detail }) => (
          <div key={label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset list */}
        <div className="card overflow-hidden lg:col-span-1">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-dark-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ativos Monitorados</h3>
            <button onClick={carregar} className="text-gray-400 hover:text-brand-500 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-dark-700 overflow-y-auto max-h-96">
            {assets.map(a => (
              <div
                key={a.id}
                onClick={() => setSelectedAsset(a)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedAsset?.id === a.id ? 'bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-dark-700/50'}`}
              >
                <StatusDot status={a.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.nome}</p>
                  <p className="text-xs text-gray-400 font-mono">{a.ip}</p>
                </div>
                <span className="text-xs text-gray-400">{a.tipo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected asset detail */}
        <div className="card p-5 lg:col-span-2">
          {selectedAsset ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <StatusDot status={selectedAsset.status} />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedAsset.nome}</h3>
                    <p className="text-xs text-gray-400 font-mono">{selectedAsset.ip} · {selectedAsset.sistema}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Último ping</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {new Date(selectedAsset.ultimo_ping).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>

              {selectedAsset.status === 'online' ? (
                <div>
                  <div className="flex items-center justify-around mb-5">
                    <MetricGauge label="CPU" value={selectedAsset.cpu_uso} max={100} color="#0b72d4" />
                    <MetricGauge label="Memória" value={selectedAsset.memoria_uso} max={100} color="#14b8a6" />
                    <MetricGauge label="Disco" value={selectedAsset.disco_uso} max={100} color="#f59e0b" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Localização', value: selectedAsset.localizacao },
                      { label: 'Responsável', value: selectedAsset.responsavel },
                      { label: 'Sistema', value: selectedAsset.sistema },
                      { label: 'Garantia', value: selectedAsset.garantia_ate },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                    <WifiOff className="w-7 h-7 text-red-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Dispositivo não responde</p>
                  <p className="text-xs text-gray-400">Localização: {selectedAsset.localizacao}</p>
                  <button className="btn-primary text-sm mt-2">Abrir Chamado</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              <Server className="w-5 h-5 mr-2" />
              Selecione um ativo para visualizar
            </div>
          )}
        </div>
      </div>

      {/* Alerts panel */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            Alertas Recentes
          </h3>
          <span className="text-xs text-gray-400">{alertas.length} alertas</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {alertas.map(alert => {
            const Icon = alertIcons[alert.tipo as keyof typeof alertIcons] ?? Info;
            const nomeAtivo = alert.ativos?.nome ?? alert.ativo_id.slice(0, 8);
            const hora = new Date(alert.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border ${alertColors[alert.tipo as keyof typeof alertColors] ?? 'text-gray-500 bg-gray-500/10 border-gray-500/20'}`}>
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{nomeAtivo}</p>
                  <p className="text-xs opacity-80 mt-0.5">{alert.mensagem}</p>
                  <p className="text-xs opacity-60 mt-1">Hoje, {hora}</p>
                </div>
                <button className="flex-shrink-0">
                  <CheckCircle className="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity" />
                </button>
              </div>
            );
          })}
          {alertas.length === 0 && (
            <p className="col-span-3 text-center text-sm text-gray-400 py-8">Nenhum alerta registrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
