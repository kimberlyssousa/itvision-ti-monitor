import { useState, useEffect } from 'react';
import { Search, Plus, Server, Laptop, Network, Printer, Shield, Router } from 'lucide-react';
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
  adquirido_em: string;
  garantia_ate: string;
}

type AssetType = 'servidor' | 'workstation' | 'notebook' | 'switch' | 'roteador' | 'impressora' | 'firewall';
type AssetStatus = 'online' | 'offline' | 'manutencao' | 'reserva';

const typeIconMap: Record<AssetType, React.ElementType> = {
  servidor: Server,
  workstation: Laptop,
  notebook: Laptop,
  switch: Network,
  roteador: Router,
  impressora: Printer,
  firewall: Shield,
};

const typeLabel: Record<AssetType, string> = {
  servidor: 'Servidor',
  workstation: 'Workstation',
  notebook: 'Notebook',
  switch: 'Switch',
  roteador: 'Roteador',
  impressora: 'Impressora',
  firewall: 'Firewall',
};

const statusMap: Record<AssetStatus, { label: string; cls: string; dot: string }> = {
  online: { label: 'Online', cls: 'badge-success', dot: 'bg-emerald-400' },
  offline: { label: 'Offline', cls: 'badge-danger', dot: 'bg-red-400' },
  manutencao: { label: 'Manutenção', cls: 'badge-warning', dot: 'bg-amber-400' },
  reserva: { label: 'Reserva', cls: 'badge-neutral', dot: 'bg-gray-400' },
};

function UsageBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right">{value}%</span>
    </div>
  );
}

export default function Ativos() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'todos'>('todos');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAtivos();
  }, []);

  async function carregarAtivos() {
    const { data, error } = await supabase
      .from('ativos')
      .select('*');

    if (!error && data) {
      setAssets(data as Asset[]);
    }
    setLoading(false);
  }

  const filtered = assets.filter(a => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.ip.includes(search) || a.localizacao.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'todos' || a.tipo === typeFilter;
    return matchSearch && matchType;
  });

  const selectedAsset = assets.find(a => a.id === selected);

  const types: Array<AssetType | 'todos'> = ['todos', 'servidor', 'switch', 'roteador', 'notebook', 'firewall', 'impressora'];

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-gray-400">Carregando ativos...</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: assets.length, color: 'text-brand-500' },
          { label: 'Online', value: assets.filter(a => a.status === 'online').length, color: 'text-emerald-500' },
          { label: 'Offline', value: assets.filter(a => a.status === 'offline').length, color: 'text-red-500' },
          { label: 'Manutenção', value: assets.filter(a => a.status === 'manutencao').length, color: 'text-amber-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ativos..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar Ativo</span>
        </button>
      </div>

      {/* Type filter */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              typeFilter === t
                ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            {t === 'todos' ? 'Todos' : typeLabel[t as AssetType]}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Grid */}
        <div className={`flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 self-start ${selected ? 'hidden lg:grid' : ''}`}>
          {filtered.map(a => {
            const Icon = typeIconMap[a.tipo as AssetType];
            const s = statusMap[a.status as AssetStatus];
            return (
              <div
                key={a.id}
                onClick={() => setSelected(selected === a.id ? null : a.id)}
                className={`card p-4 cursor-pointer hover:shadow-md dark:hover:shadow-dark-900/50 transition-all duration-200 ${selected === a.id ? 'border-brand-500/50 bg-brand-500/5' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gray-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                      {Icon && <Icon className="w-4.5 h-4.5 text-gray-600 dark:text-gray-300" style={{ width: '18px', height: '18px' }} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.nome}</p>
                      <p className="text-xs text-gray-400">{typeLabel[a.tipo as AssetType] || a.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${s?.dot} ${a.status === 'online' ? 'animate-pulse-slow' : ''}`} />
                    <span className={s?.cls || 'badge-neutral'}>{s?.label || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3 font-mono">{a.ip}</p>
                {a.status === 'online' && (
                  <div className="space-y-1.5">
                    <UsageBar value={a.cpu_uso} color="bg-brand-500" />
                    <UsageBar value={a.memoria_uso} color="bg-teal-500" />
                    <UsageBar value={a.disco_uso} color="bg-amber-500" />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3 truncate">{a.localizacao}</p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400 text-sm">Nenhum ativo encontrado.</div>
          )}
        </div>

        {/* Detail */}
        {selectedAsset && (
          <div className="w-full lg:w-80 flex-shrink-0 card p-5 animate-slide-in self-start">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-400">{selectedAsset.id.slice(0, 8)}</span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-xl flex items-center justify-center">
                {(() => { const I = typeIconMap[selectedAsset.tipo as AssetType]; return I ? <I className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : null; })()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{selectedAsset.nome}</h3>
                <span className={statusMap[selectedAsset.status as AssetStatus]?.cls || 'badge-neutral'}>{statusMap[selectedAsset.status as AssetStatus]?.label || 'N/A'}</span>
              </div>
            </div>
            {selectedAsset.status === 'online' && (
              <div className="mb-5 space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Uso de Recursos</p>
                <div className="space-y-2">
                  {[
                    { label: 'CPU', value: selectedAsset.cpu_uso, color: 'bg-brand-500' },
                    { label: 'Memória', value: selectedAsset.memoria_uso, color: 'bg-teal-500' },
                    { label: 'Disco', value: selectedAsset.disco_uso, color: 'bg-amber-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-12">{label}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              {[
                { label: 'Tipo', value: typeLabel[selectedAsset.tipo as AssetType] || selectedAsset.tipo },
                { label: 'IP', value: selectedAsset.ip },
                { label: 'MAC', value: selectedAsset.mac },
                { label: 'Sistema', value: selectedAsset.sistema },
                { label: 'Localização', value: selectedAsset.localizacao },
                { label: 'Responsável', value: selectedAsset.responsavel },
                { label: 'Garantia', value: selectedAsset.garantia_ate },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-dark-700 last:border-0 gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-mono text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
