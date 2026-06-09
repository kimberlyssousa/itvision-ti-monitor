export type TicketStatus = 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'fechado';
export type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica';
export type AssetStatus = 'online' | 'offline' | 'manutencao' | 'reserva';
export type AssetType = 'servidor' | 'workstation' | 'notebook' | 'switch' | 'roteador' | 'impressora' | 'firewall';

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: TicketStatus;
  prioridade: TicketPriority;
  categoria: string;
  solicitante: string;
  atribuido: string;
  criado_em: string;
  atualizado_em: string;
  sla_vencimento: string;
  sla_cumprido: boolean;
}

export interface Asset {
  id: string;
  nome: string;
  tipo: AssetType;
  ip: string;
  mac: string;
  sistema: string;
  localizacao: string;
  responsavel: string;
  status: AssetStatus;
  cpu_uso: number;
  memoria_uso: number;
  disco_uso: number;
  ultimo_ping: string;
  adquirido_em: string;
  garantia_ate: string;
}

export interface KnowledgeArticle {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string;
  autor: string;
  views: number;
  likes: number;
  criado_em: string;
  tags: string[];
}

export interface DashboardStat {
  total_chamados: number;
  chamados_abertos: number;
  chamados_em_andamento: number;
  chamados_resolvidos: number;
  chamados_criticos: number;
  sla_cumprido: number;
  sla_total: number;
  equipamentos_online: number;
  equipamentos_offline: number;
  equipamentos_manutencao: number;
  total_ativos: number;
}

export const dashboardStats: DashboardStat = {
  total_chamados: 248,
  chamados_abertos: 34,
  chamados_em_andamento: 18,
  chamados_resolvidos: 196,
  chamados_criticos: 5,
  sla_cumprido: 221,
  sla_total: 248,
  equipamentos_online: 142,
  equipamentos_offline: 8,
  equipamentos_manutencao: 3,
  total_ativos: 153,
};

export const tickets: Ticket[] = [
  {
    id: 'CHM-001',
    titulo: 'Servidor de produção fora do ar',
    descricao: 'O servidor principal de produção (SRV-PROD-01) parou de responder. Todos os serviços dependentes estão inacessíveis.',
    status: 'em_andamento',
    prioridade: 'critica',
    categoria: 'Infraestrutura',
    solicitante: 'Carlos Mendes',
    atribuido: 'Kimberly Sousa',
    criado_em: '2026-06-03T08:15:00',
    atualizado_em: '2026-06-03T09:30:00',
    sla_vencimento: '2026-06-03T12:15:00',
    sla_cumprido: false,
  },
  {
    id: 'CHM-002',
    titulo: 'VPN não conecta para usuários remotos',
    descricao: 'Usuários do setor financeiro relatam que a VPN retorna erro de autenticação desde às 07h.',
    status: 'em_andamento',
    prioridade: 'alta',
    categoria: 'Rede',
    solicitante: 'Ana Paula Lima',
    atribuido: 'Felipe Costa',
    criado_em: '2026-06-03T07:45:00',
    atualizado_em: '2026-06-03T08:50:00',
    sla_vencimento: '2026-06-03T15:45:00',
    sla_cumprido: true,
  },
  {
    id: 'CHM-003',
    titulo: 'Impressora do RH não imprime',
    descricao: 'A impressora HP LaserJet do setor de RH não responde a comandos de impressão.',
    status: 'aberto',
    prioridade: 'media',
    categoria: 'Hardware',
    solicitante: 'Mariana Ferreira',
    atribuido: '',
    criado_em: '2026-06-03T09:00:00',
    atualizado_em: '2026-06-03T09:00:00',
    sla_vencimento: '2026-06-04T09:00:00',
    sla_cumprido: true,
  },
  {
    id: 'CHM-004',
    titulo: 'Lentidão no sistema ERP',
    descricao: 'O sistema ERP está com lentidão excessiva. Consultas que levavam 2s agora demoram mais de 30s.',
    status: 'aberto',
    prioridade: 'alta',
    categoria: 'Software',
    solicitante: 'Roberto Alves',
    atribuido: 'Beatriz Santos',
    criado_em: '2026-06-02T16:30:00',
    atualizado_em: '2026-06-03T08:00:00',
    sla_vencimento: '2026-06-03T16:30:00',
    sla_cumprido: true,
  },
  {
    id: 'CHM-005',
    titulo: 'Solicitação de novo notebook',
    descricao: 'Novo colaborador do setor de TI precisa de notebook para início das atividades.',
    status: 'aguardando',
    prioridade: 'baixa',
    categoria: 'Aquisição',
    solicitante: 'Gestão de Pessoas',
    atribuido: 'Lucas Oliveira',
    criado_em: '2026-06-01T10:00:00',
    atualizado_em: '2026-06-02T14:00:00',
    sla_vencimento: '2026-06-08T10:00:00',
    sla_cumprido: true,
  },
  {
    id: 'CHM-006',
    titulo: 'Email corporativo bloqueado',
    descricao: 'Usuário João Silva não consegue acessar o email corporativo. Senha expirada.',
    status: 'resolvido',
    prioridade: 'media',
    categoria: 'Acesso',
    solicitante: 'João Silva',
    atribuido: 'Felipe Costa',
    criado_em: '2026-06-02T14:20:00',
    atualizado_em: '2026-06-02T15:10:00',
    sla_vencimento: '2026-06-03T14:20:00',
    sla_cumprido: true,
  },
  {
    id: 'CHM-007',
    titulo: 'Switch do andar 3 com falha',
    descricao: 'Switch Cisco Catalyst do 3º andar está reiniciando a cada 20 minutos, causando quedas de conectividade.',
    status: 'em_andamento',
    prioridade: 'critica',
    categoria: 'Rede',
    solicitante: 'Operações',
    atribuido: 'Kimberly Sousa',
    criado_em: '2026-06-03T06:00:00',
    atualizado_em: '2026-06-03T07:15:00',
    sla_vencimento: '2026-06-03T10:00:00',
    sla_cumprido: false,
  },
  {
    id: 'CHM-008',
    titulo: 'Backup não executou ontem',
    descricao: 'O job de backup noturno falhou. Nenhum arquivo foi salvo no storage S3.',
    status: 'aberto',
    prioridade: 'alta',
    categoria: 'Backup',
    solicitante: 'Sistema Automatizado',
    atribuido: 'Beatriz Santos',
    criado_em: '2026-06-03T06:30:00',
    atualizado_em: '2026-06-03T06:30:00',
    sla_vencimento: '2026-06-03T14:30:00',
    sla_cumprido: true,
  },
];

export const assets: Asset[] = [
  {
    id: 'SRV-001',
    nome: 'SRV-PROD-01',
    tipo: 'servidor',
    ip: '10.0.1.10',
    mac: '00:1A:2B:3C:4D:5E',
    sistema: 'Ubuntu Server 22.04 LTS',
    localizacao: 'Data Center - Rack A1',
    responsavel: 'Kimberly Sousa',
    status: 'offline',
    cpu_uso: 0,
    memoria_uso: 0,
    disco_uso: 78,
    ultimo_ping: '2026-06-03T08:10:00',
    adquirido_em: '2022-03-15',
    garantia_ate: '2027-03-15',
  },
  {
    id: 'SRV-002',
    nome: 'SRV-DB-01',
    tipo: 'servidor',
    ip: '10.0.1.11',
    mac: '00:1A:2B:3C:4D:5F',
    sistema: 'Windows Server 2022',
    localizacao: 'Data Center - Rack A2',
    responsavel: 'Kimberly Sousa',
    status: 'online',
    cpu_uso: 45,
    memoria_uso: 67,
    disco_uso: 55,
    ultimo_ping: '2026-06-03T09:32:00',
    adquirido_em: '2022-03-15',
    garantia_ate: '2027-03-15',
  },
  {
    id: 'SRV-003',
    nome: 'SRV-WEB-01',
    tipo: 'servidor',
    ip: '10.0.1.12',
    mac: '00:1A:2B:3C:4D:60',
    sistema: 'CentOS Stream 9',
    localizacao: 'Data Center - Rack B1',
    responsavel: 'Felipe Costa',
    status: 'online',
    cpu_uso: 23,
    memoria_uso: 41,
    disco_uso: 38,
    ultimo_ping: '2026-06-03T09:32:00',
    adquirido_em: '2023-01-20',
    garantia_ate: '2028-01-20',
  },
  {
    id: 'SW-001',
    nome: 'SW-CORE-01',
    tipo: 'switch',
    ip: '10.0.0.1',
    mac: 'AA:BB:CC:DD:EE:01',
    sistema: 'Cisco IOS 16.12',
    localizacao: 'Data Center - Rack C1',
    responsavel: 'Felipe Costa',
    status: 'online',
    cpu_uso: 12,
    memoria_uso: 28,
    disco_uso: 10,
    ultimo_ping: '2026-06-03T09:32:00',
    adquirido_em: '2021-06-10',
    garantia_ate: '2026-06-10',
  },
  {
    id: 'SW-002',
    nome: 'SW-ANDAR3-01',
    tipo: 'switch',
    ip: '10.0.3.1',
    mac: 'AA:BB:CC:DD:EE:02',
    sistema: 'Cisco IOS 15.2',
    localizacao: '3º Andar - Rack D1',
    responsavel: 'Felipe Costa',
    status: 'manutencao',
    cpu_uso: 0,
    memoria_uso: 0,
    disco_uso: 5,
    ultimo_ping: '2026-06-03T06:05:00',
    adquirido_em: '2019-11-05',
    garantia_ate: '2024-11-05',
  },
  {
    id: 'NB-001',
    nome: 'NB-DEV-MARIA',
    tipo: 'notebook',
    ip: '10.0.5.45',
    mac: 'CC:DD:EE:FF:00:11',
    sistema: 'macOS Sonoma 14.4',
    localizacao: 'TI - Mesa 12',
    responsavel: 'Maria Oliveira',
    status: 'online',
    cpu_uso: 34,
    memoria_uso: 72,
    disco_uso: 61,
    ultimo_ping: '2026-06-03T09:31:00',
    adquirido_em: '2024-02-01',
    garantia_ate: '2027-02-01',
  },
  {
    id: 'FW-001',
    nome: 'FW-EDGE-01',
    tipo: 'firewall',
    ip: '192.168.0.1',
    mac: 'FF:EE:DD:CC:BB:01',
    sistema: 'pfSense 2.7.2',
    localizacao: 'Data Center - Rack C2',
    responsavel: 'Kimberly Sousa',
    status: 'online',
    cpu_uso: 8,
    memoria_uso: 15,
    disco_uso: 22,
    ultimo_ping: '2026-06-03T09:32:00',
    adquirido_em: '2023-07-01',
    garantia_ate: '2028-07-01',
  },
  {
    id: 'RT-001',
    nome: 'RT-BORDER-01',
    tipo: 'roteador',
    ip: '192.168.0.2',
    mac: 'FF:EE:DD:CC:BB:02',
    sistema: 'Cisco IOS-XE 17.6',
    localizacao: 'Data Center - Rack C3',
    responsavel: 'Felipe Costa',
    status: 'online',
    cpu_uso: 5,
    memoria_uso: 20,
    disco_uso: 8,
    ultimo_ping: '2026-06-03T09:32:00',
    adquirido_em: '2022-09-12',
    garantia_ate: '2027-09-12',
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    titulo: 'Como configurar VPN no Windows 11',
    categoria: 'Rede',
    conteudo: 'Guia passo a passo para configuração da VPN corporativa em dispositivos Windows 11.',
    autor: 'Felipe Costa',
    views: 342,
    likes: 28,
    criado_em: '2026-01-15',
    tags: ['vpn', 'windows', 'rede', 'acesso-remoto'],
  },
  {
    id: 'KB-002',
    titulo: 'Procedimento de reset de senha no Active Directory',
    categoria: 'Acesso',
    conteudo: 'Instruções para reset de senha e desbloqueio de usuários no AD.',
    autor: 'Kimberly Sousa',
    views: 521,
    likes: 45,
    criado_em: '2025-11-20',
    tags: ['active-directory', 'senha', 'acesso', 'ad'],
  },
  {
    id: 'KB-003',
    titulo: 'Solução de problemas de impressora em rede',
    categoria: 'Hardware',
    conteudo: 'Troubleshooting de impressoras HP e Xerox conectadas na rede corporativa.',
    autor: 'Lucas Oliveira',
    views: 187,
    likes: 14,
    criado_em: '2026-02-10',
    tags: ['impressora', 'hardware', 'troubleshooting'],
  },
  {
    id: 'KB-004',
    titulo: 'Backup e restauração no Veeam Backup',
    categoria: 'Backup',
    conteudo: 'Procedimentos de backup, verificação e restauração utilizando Veeam Backup & Replication.',
    autor: 'Beatriz Santos',
    views: 256,
    likes: 31,
    criado_em: '2025-12-05',
    tags: ['backup', 'veeam', 'recuperacao', 'dados'],
  },
  {
    id: 'KB-005',
    titulo: 'Monitoramento de servidores com Grafana + Prometheus',
    categoria: 'Monitoramento',
    conteudo: 'Configuração e uso do stack Grafana + Prometheus para monitoramento de infraestrutura.',
    autor: 'Kimberly Sousa',
    views: 412,
    likes: 52,
    criado_em: '2026-03-01',
    tags: ['grafana', 'prometheus', 'monitoramento', 'infraestrutura'],
  },
  {
    id: 'KB-006',
    titulo: 'Hardening de servidores Linux',
    categoria: 'Segurança',
    conteudo: 'Checklist de segurança para endurecimento de servidores Ubuntu e CentOS.',
    autor: 'Kimberly Sousa',
    views: 298,
    likes: 39,
    criado_em: '2026-04-10',
    tags: ['segurança', 'linux', 'hardening', 'servidor'],
  },
];

export const monitoringAlerts = [
  { id: 1, ativo: 'SRV-PROD-01', tipo: 'critico', mensagem: 'Host não responde ao ping', tempo: '08:10' },
  { id: 2, ativo: 'SW-ANDAR3-01', tipo: 'critico', mensagem: 'Interface down: GigabitEthernet0/1', tempo: '06:03' },
  { id: 3, ativo: 'SRV-DB-01', tipo: 'aviso', mensagem: 'Uso de memória acima de 65%', tempo: '09:15' },
  { id: 4, ativo: 'NB-DEV-MARIA', tipo: 'aviso', mensagem: 'Uso de memória acima de 70%', tempo: '09:28' },
  { id: 5, ativo: 'FW-EDGE-01', tipo: 'info', mensagem: 'Regra de firewall atualizada', tempo: '07:00' },
];

export const chartData = {
  chamadosPorDia: [
    { dia: 'Seg', abertos: 12, resolvidos: 8 },
    { dia: 'Ter', abertos: 9, resolvidos: 14 },
    { dia: 'Qua', abertos: 15, resolvidos: 11 },
    { dia: 'Qui', abertos: 7, resolvidos: 13 },
    { dia: 'Sex', abertos: 10, resolvidos: 9 },
    { dia: 'Sab', abertos: 3, resolvidos: 5 },
    { dia: 'Dom', abertos: 1, resolvidos: 2 },
  ],
  categorias: [
    { nome: 'Infraestrutura', valor: 68 },
    { nome: 'Rede', valor: 54 },
    { nome: 'Software', valor: 72 },
    { nome: 'Hardware', valor: 31 },
    { nome: 'Acesso', valor: 48 },
    { nome: 'Backup', valor: 15 },
  ],
};
