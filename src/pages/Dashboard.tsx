import { useEffect, useState } from 'react';
import {
  TicketCheck,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Clock,
  Server,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Ticket {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  categoria: string;
  solicitante: string;
  atribuido: string;
  sla_cumprido: boolean;
  criado_em: string;
}

interface Asset {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  cpu_uso: number;
  memoria_uso: number;
  disco_uso: number;
}

interface Alert {
  id: string;
  ativo_id: string;
  tipo: string;
  mensagem: string;
  criado_em: string;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <div className="card p-5 hover:shadow-md dark:hover:shadow-dark-900/50 transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.up ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SlaRing({ percent }: { percent: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color = percent >= 90 ? '#10b981' : percent >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-dark-700" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50" y="46" textAnchor="middle" className="fill-gray-900 dark:fill-white" style={{ fontSize: '16px', fontWeight: 700 }}>
        {percent}%
      </text>
      <text x="50" y="60" textAnchor="middle" fill="#6b7280" style={{ fontSize: '8px' }}>SLA</text>
    </svg>
  );
}

function BarChart({ data }: { data: Array<{ dia: string; abertos: number; resolvidos: number }> }) {
  const max = Math.max(...data.flatMap(d => [d.abertos, d.resolvidos]), 1);
  return (
    <div className="flex items-end gap-2 h-36 px-2">
      {data.map(d => (
        <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-0.5 h-28 w-full">
            <div
              className="flex-1 bg-brand-500/70 rounded-t-sm transition-all duration-700"
              style={{ height: `${(d.abertos / max) * 100}%` }}
              title={`Abertos: ${d.abertos}`}
            />
            <div
              className="flex-1 bg-emerald-500/70 rounded-t-sm transition-all duration-700"
              style={{ height: `${(d.resolvidos / max) * 100}%` }}
              title={`Resolvidos: ${d.resolvidos}`}
            />
          </div>
          <span className="text-xs text-gray-400">{d.dia}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryBar({ nome, valor, max }: { nome: string; valor: number; max: number }) {
  const pct = max > 0 ? (valor / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate">{nome}</span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-6 text-right">{valor}</span>
    </div>
  );
}

const statusMap: Record<string, { label: string; cls: string }> = {
  aberto: { label: 'Aberto', cls: 'badge-info' },
  em_andamento: { label: 'Em andamento', cls: 'badge-warning' },
  aguardando: { label: 'Aguardando', cls: 'badge-neutral' },
  resolvido: { label: 'Resolvido', cls: 'badge-success' },
  fechado: { label: 'Fechado', cls: 'badge-neutral' },
};

const priorMap: Record<string, { label: string; cls: string }> = {
  baixa: { label: 'Baixa', cls: 'badge-success' },
  media: { label: 'Média', cls: 'badge-info' },
  alta: { label: 'Alta', cls: 'badge-warning' },
  critica: { label: 'Crítica', cls: 'badge-danger' },
};

const alertColors: Record<string, string> = {
  critico: 'text-red-500 bg-red-500/10',
  aviso: 'text-amber-500 bg-amber-500/10',
  info: 'text-blue-500 bg-blue-500/10',
};

export default function Dashboard() {
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [ativos, setAtivos] = useState<Asset[]>([]);
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarChamados();
    carregarAtivos();
    carregarAlertas();
  }, []);

  async function carregarChamados() {
    const { data, error } = await supabase
      .from('chamados')
      .select('*');

    if (!error && data) {
      setChamados(data as Ticket[]);
    }
    setLoading(false);
  }

  async function carregarAtivos() {
    const { data, error } = await supabase
      .from('ativos')
      .select('*');

    if (!error && data) {
      setAtivos(data as Asset[]);
    }
  }

  async function carregarAlertas() {
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(5);

    if (!error && data) {
      setAlertas(data as Alert[]);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
  const chamadosEmAndamento = chamados.filter(c => c.status === 'em_andamento').length;
  const chamadosResolvidos = chamados.filter(c => c.status === 'resolvido').length;
  const chamadosCriticos = chamados.filter(c => c.prioridade === 'critica').length;
  const slaCumprido = chamados.filter(c => c.sla_cumprido).length;
  const slaNaoCumprido = totalChamados - slaCumprido;

  const equipamentosOnline = ativos.filter(a => a.status === 'online').length;
  const equipamentosOffline = ativos.filter(a => a.status === 'offline').length;
  const equipamentosManutencao = ativos.filter(a => a.status === 'manutencao').length;
  const totalAtivos = ativos.length;

  const slaPercent = totalChamados > 0 ? Math.round((slaCumprido / totalChamados) * 100) : 0;

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const hoje = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - (6 - i));
    const inicio = new Date(d); inicio.setHours(0, 0, 0, 0);
    const fim = new Date(d); fim.setHours(23, 59, 59, 999);
    const doChamados = chamados.filter(c => {
      const dt = new Date(c.criado_em || '');
      return dt >= inicio && dt <= fim;
    });
    return {
      dia: diasSemana[d.getDay()],
      abertos: doChamados.filter(c => c.status !== 'resolvido' && c.status !== 'fechado').length,
      resolvidos: doChamados.filter(c => c.status === 'resolvido' || c.status === 'fechado').length,
    };
  });

  const categoriasCounts = chamados.reduce((acc, c) => {
    const existing = acc.find(x => x.nome === c.categoria);
    if (existing) {
      existing.valor++;
    } else {
      acc.push({ nome: c.categoria || 'Sem categoria', valor: 1 });
    }
    return acc;
  }, [] as Array<{ nome: string; valor: number }>);

  const maxCategoria = Math.max(...categoriasCounts.map(c => c.valor), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => { setLoading(true); carregarChamados(); carregarAtivos(); carregarAlertas(); }} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Chamados"
          value={totalChamados}
          sub={`${chamadosAbertos} abertos agora`}
          icon={TicketCheck}
          color="bg-brand-500/15 text-brand-500"
          trend={{ value: '+12%', up: true }}
        />
        <StatCard
          title="SLA Cumprido"
          value={`${slaPercent}%`}
          sub={`${slaCumprido} de ${totalChamados}`}
          icon={CheckCircle2}
          color="bg-emerald-500/15 text-emerald-500"
          trend={{ value: '+3%', up: true }}
        />
        <StatCard
          title="Equipamentos Online"
          value={equipamentosOnline}
          sub={`de ${totalAtivos} ativos`}
          icon={Wifi}
          color="bg-teal-500/15 text-teal-500"
          trend={{ value: `${Math.round((equipamentosOnline / totalAtivos) * 100)}%`, up: true }}
        />
        <StatCard
          title="Equipamentos Offline"
          value={equipamentosOffline}
          sub={`${equipamentosManutencao} em manutenção`}
          icon={WifiOff}
          color="bg-red-500/15 text-red-500"
          trend={{ value: `-${equipamentosOffline}`, up: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Desempenho SLA</h3>
          <div className="flex items-center gap-5">
            <SlaRing percent={slaPercent} />
            <div className="space-y-3 flex-1">
              {[
                { label: 'Cumpridos', value: slaCumprido, color: 'text-emerald-500' },
                { label: 'Violados', value: slaNaoCumprido, color: 'text-red-500' },
                { label: 'Críticos abertos', value: chamadosCriticos, color: 'text-amber-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Chamados por Dia</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500/70 inline-block" /> Abertos</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70 inline-block" /> Resolvidos</span>
            </div>
          </div>
          <BarChart data={chartData} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Por Categoria</h3>
          <div className="space-y-3">
            {categoriasCounts.map(c => (
              <CategoryBar key={c.nome} nome={c.nome} valor={c.valor} max={maxCategoria} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Chamados Recentes</h3>
            <a href="/chamados" className="text-brand-500 text-xs hover:underline">Ver todos</a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-dark-700">
            {chamados.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{t.id.slice(0, 8)}</span>
                    <span className={priorMap[t.prioridade]?.cls ?? 'badge-neutral'}>{priorMap[t.prioridade]?.label ?? 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{t.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.solicitante} · {t.categoria}</p>
                </div>
                <span className={statusMap[t.status]?.cls ?? 'badge-neutral'}>{statusMap[t.status]?.label ?? 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                Alertas
              </h3>
              <span className="badge-danger">{alertas.filter(a => a.tipo === 'critico').length}</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-700">
              {alertas.map(a => (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${alertColors[a.tipo] ?? 'text-gray-500'}`}>
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">Alert</p>
                    <p className="text-xs text-gray-400 truncate">{a.mensagem}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />Hoje
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-500" />
              Infraestrutura
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Servidores', online: ativos.filter(a => a.tipo === 'servidor' && a.status === 'online').length, total: ativos.filter(a => a.tipo === 'servidor').length },
                { label: 'Switches', online: ativos.filter(a => a.tipo === 'switch' && a.status === 'online').length, total: ativos.filter(a => a.tipo === 'switch').length },
                { label: 'Firewalls', online: ativos.filter(a => a.tipo === 'firewall' && a.status === 'online').length, total: ativos.filter(a => a.tipo === 'firewall').length },
                { label: 'Notebooks', online: ativos.filter(a => a.tipo === 'notebook' && a.status === 'online').length, total: ativos.filter(a => a.tipo === 'notebook').length },
              ].map(({ label, online, total }) => (
                <div key={label} className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{online}<span className="text-xs font-normal text-gray-400">/{total}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
