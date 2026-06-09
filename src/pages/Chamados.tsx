import { useState, useEffect } from 'react';
import { Search, Plus, Filter, ChevronDown, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  categoria: string;
  solicitante: string;
  atribuido: string;
  criado_em: string;
  sla_vencimento: string;
  sla_cumprido: boolean;
}

type TicketStatus = 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'fechado';
type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica';

const statusMap: Record<TicketStatus, { label: string; cls: string }> = {
  aberto: { label: 'Aberto', cls: 'badge-info' },
  em_andamento: { label: 'Em andamento', cls: 'badge-warning' },
  aguardando: { label: 'Aguardando', cls: 'badge-neutral' },
  resolvido: { label: 'Resolvido', cls: 'badge-success' },
  fechado: { label: 'Fechado', cls: 'badge-neutral' },
};

const priorMap: Record<TicketPriority, { label: string; cls: string; dot: string }> = {
  baixa: { label: 'Baixa', cls: 'badge-success', dot: 'bg-emerald-500' },
  media: { label: 'Média', cls: 'badge-info', dot: 'bg-blue-500' },
  alta: { label: 'Alta', cls: 'badge-warning', dot: 'bg-amber-500' },
  critica: { label: 'Crítica', cls: 'badge-danger', dot: 'bg-red-500' },
};

const categorias = ['Infraestrutura', 'Rede', 'Software', 'Hardware', 'Acesso', 'Backup', 'Aquisição'];
const prioridades: TicketPriority[] = ['baixa', 'media', 'alta', 'critica'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Chamados() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>('todos');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Software');
  const [prioridade, setPrioridade] = useState<TicketPriority>('media');
  const [solicitante, setSolicitante] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarChamados();
  }, []);

  async function carregarChamados() {
    const { data, error } = await supabase
      .from('chamados')
      .select('*');

    if (!error && data) {
      setTickets(data as Ticket[]);
    }
    setLoading(false);
  }

  async function assumirChamado(id: string) {
    await supabase
      .from('chamados')
      .update({ atribuido: 'Kimberly Sousa', status: 'em_andamento' })
      .eq('id', id);
    await carregarChamados();
  }

  async function resolverChamado(id: string) {
    await supabase
      .from('chamados')
      .update({ status: 'resolvido', sla_cumprido: true })
      .eq('id', id);
    await carregarChamados();
  }

  async function criarChamado() {
    if (!titulo.trim()) return;
    setSaving(true);

    await supabase
      .from('chamados')
      .insert([
        {
          titulo,
          descricao,
          categoria,
          prioridade,
          solicitante: solicitante || 'Usuário',
          status: 'aberto',
          sla_cumprido: true,
        }
      ]);

    setTitulo('');
    setDescricao('');
    setCategoria('Software');
    setPrioridade('media');
    setSolicitante('');
    setShowForm(false);
    setSaving(false);
    await carregarChamados();
  }

  const filtered = tickets.filter(t => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.solicitante.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = tickets.find(t => t.id === selectedTicket);

  const counts = {
    todos: tickets.length,
    aberto: tickets.filter(t => t.status === 'aberto').length,
    em_andamento: tickets.filter(t => t.status === 'em_andamento').length,
    aguardando: tickets.filter(t => t.status === 'aguardando').length,
    resolvido: tickets.filter(t => t.status === 'resolvido').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-gray-400">Carregando chamados...</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar chamados..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-brand-500 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Chamado</span>
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {([['todos', 'Todos'], ['aberto', 'Abertos'], ['em_andamento', 'Em andamento'], ['aguardando', 'Aguardando'], ['resolvido', 'Resolvidos']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === key
                ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === key ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-gray-400'}`}>
              {counts[key as keyof typeof counts] ?? ''}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className={`card overflow-hidden flex-1 min-w-0 ${selected ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-700">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">Título</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden md:table-cell">Prioridade</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden lg:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden xl:table-cell">Atribuído</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden xl:table-cell">Criado em</th>
                  <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3 hidden sm:table-cell">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                {filtered.map(t => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(selectedTicket === t.id ? null : t.id)}
                    className={`cursor-pointer transition-colors ${selectedTicket === t.id ? 'bg-brand-500/5' : 'hover:bg-gray-50 dark:hover:bg-dark-700/50'}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-gray-400">{t.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorMap[t.prioridade as TicketPriority]?.dot || 'bg-gray-400'}`} />
                        <span className="text-sm text-gray-900 dark:text-white truncate">{t.titulo}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{t.categoria} · {t.solicitante}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={priorMap[t.prioridade as TicketPriority]?.cls || 'badge-neutral'}>{priorMap[t.prioridade as TicketPriority]?.label || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className={statusMap[t.status as TicketStatus]?.cls || 'badge-neutral'}>{statusMap[t.status as TicketStatus]?.label || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell text-sm text-gray-500 dark:text-gray-400">
                      {t.atribuido || <span className="text-gray-300 dark:text-dark-600">—</span>}
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(t.criado_em)}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-right">
                      {t.sla_cumprido
                        ? <span className="badge-success">OK</span>
                        : <span className="badge-danger">Violado</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Nenhum chamado encontrado.</div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-96 flex-shrink-0 card p-5 animate-slide-in self-start">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-gray-400">{selected.id.slice(0, 8)}</span>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">✕</button>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">{selected.titulo}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">{selected.descricao}</p>
            <div className="space-y-3">
              {[
                { label: 'Status', value: <span className={statusMap[selected.status as TicketStatus]?.cls || 'badge-neutral'}>{statusMap[selected.status as TicketStatus]?.label || 'N/A'}</span> },
                { label: 'Prioridade', value: <span className={priorMap[selected.prioridade as TicketPriority]?.cls || 'badge-neutral'}>{priorMap[selected.prioridade as TicketPriority]?.label || 'N/A'}</span> },
                { label: 'Categoria', value: <span className="text-sm text-gray-700 dark:text-gray-300">{selected.categoria}</span> },
                { label: 'Solicitante', value: <span className="text-sm text-gray-700 dark:text-gray-300">{selected.solicitante}</span> },
                { label: 'Atribuído', value: <span className="text-sm text-gray-700 dark:text-gray-300">{selected.atribuido || '—'}</span> },
                { label: 'Criado em', value: <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(selected.criado_em)}</span> },
                { label: 'Venc. SLA', value: <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(selected.sla_vencimento)}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-700 last:border-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  {value}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => selected && assumirChamado(selected.id)}
                className="flex-1 btn-primary text-sm py-2"
                disabled={selected?.status === 'resolvido' || selected?.status === 'fechado'}
              >
                Assumir
              </button>
              <button
                onClick={() => selected && resolverChamado(selected.id)}
                className="flex-1 btn-secondary text-sm py-2"
                disabled={selected?.status === 'resolvido' || selected?.status === 'fechado'}
              >
                Resolver
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Novo Chamado */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Chamado</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título</label>
                <input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Descreva o problema resumidamente"
                  className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Forneça detalhes adicionais sobre o problema..."
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria</label>
                  <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  >
                    {categorias.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={e => setPrioridade(e.target.value as TicketPriority)}
                    className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  >
                    {prioridades.map(p => (
                      <option key={p} value={p}>{priorMap[p].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Solicitante</label>
                <input
                  value={solicitante}
                  onChange={e => setSolicitante(e.target.value)}
                  placeholder="Nome do solicitante"
                  className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-dark-700">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={criarChamado}
                disabled={!titulo.trim() || saving}
                className="btn-primary px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
