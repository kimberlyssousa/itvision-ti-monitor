/*
  # IT Vision Core Tables

  1. New Tables
    - `chamados` - Support tickets with SLA tracking
      - id (uuid, pk)
      - titulo, descricao, categoria
      - status, prioridade
      - solicitante, atribuido
      - criado_em, atualizado_em, sla_vencimento
      - sla_cumprido (boolean)
    
    - `ativos` - Network/server assets
      - id (uuid, pk)
      - nome, tipo, ip, mac, sistema
      - localizacao, responsavel
      - status, cpu_uso, memoria_uso, disco_uso
      - ultimo_ping, adquirido_em, garantia_ate
    
    - `alertas` - Monitoring alerts
      - id (uuid, pk)
      - ativo_id, tipo, mensagem
      - criado_em

  2. Security
    - RLS enabled on all tables
    - Public read access for authenticated users
    - Insert/update restricted to service role
*/

-- Chamados table
CREATE TABLE IF NOT EXISTS chamados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL DEFAULT 'aberto',
  prioridade text NOT NULL DEFAULT 'media',
  categoria text,
  solicitante text NOT NULL,
  atribuido text,
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now(),
  sla_vencimento timestamptz,
  sla_cumprido boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chamados readable by authenticated users"
  ON chamados FOR SELECT
  TO authenticated
  USING (true);

-- Ativos table
CREATE TABLE IF NOT EXISTS ativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo text NOT NULL,
  ip text UNIQUE,
  mac text,
  sistema text,
  localizacao text,
  responsavel text,
  status text NOT NULL DEFAULT 'online',
  cpu_uso integer DEFAULT 0,
  memoria_uso integer DEFAULT 0,
  disco_uso integer DEFAULT 0,
  ultimo_ping timestamptz DEFAULT now(),
  adquirido_em date,
  garantia_ate date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ativos readable by authenticated users"
  ON ativos FOR SELECT
  TO authenticated
  USING (true);

-- Alertas table
CREATE TABLE IF NOT EXISTS alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ativo_id uuid REFERENCES ativos(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  mensagem text NOT NULL,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alertas readable by authenticated users"
  ON alertas FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS chamados_status_idx ON chamados(status);
CREATE INDEX IF NOT EXISTS chamados_prioridade_idx ON chamados(prioridade);
CREATE INDEX IF NOT EXISTS ativos_status_idx ON ativos(status);
CREATE INDEX IF NOT EXISTS ativos_tipo_idx ON ativos(tipo);
CREATE INDEX IF NOT EXISTS alertas_ativo_id_idx ON alertas(ativo_id);
