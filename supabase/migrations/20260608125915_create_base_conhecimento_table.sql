CREATE TABLE IF NOT EXISTS base_conhecimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  categoria text NOT NULL,
  conteudo text NOT NULL,
  autor text NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE base_conhecimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "base_conhecimento public read"
  ON base_conhecimento FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "base_conhecimento public insert"
  ON base_conhecimento FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "base_conhecimento public update"
  ON base_conhecimento FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "base_conhecimento public delete"
  ON base_conhecimento FOR DELETE
  TO anon, authenticated
  USING (true);

INSERT INTO base_conhecimento (titulo, categoria, conteudo, autor, views, likes, tags, criado_em) VALUES
  ('Como configurar VPN no Windows 11', 'Rede', 'Guia passo a passo para configuração da VPN corporativa em dispositivos Windows 11.', 'Felipe Costa', 342, 28, ARRAY['vpn','windows','rede','acesso-remoto'], '2026-01-15'),
  ('Procedimento de reset de senha no Active Directory', 'Acesso', 'Instruções para reset de senha e desbloqueio de usuários no AD.', 'Kimberly Sousa', 521, 45, ARRAY['active-directory','senha','acesso','ad'], '2025-11-20'),
  ('Solução de problemas de impressora em rede', 'Hardware', 'Troubleshooting de impressoras HP e Xerox conectadas na rede corporativa.', 'Lucas Oliveira', 187, 14, ARRAY['impressora','hardware','troubleshooting'], '2026-02-10'),
  ('Backup e restauração no Veeam Backup', 'Backup', 'Procedimentos de backup, verificação e restauração utilizando Veeam Backup & Replication.', 'Beatriz Santos', 256, 31, ARRAY['backup','veeam','recuperacao','dados'], '2025-12-05'),
  ('Monitoramento de servidores com Grafana + Prometheus', 'Monitoramento', 'Configuração e uso do stack Grafana + Prometheus para monitoramento de infraestrutura.', 'Kimberly Sousa', 412, 52, ARRAY['grafana','prometheus','monitoramento','infraestrutura'], '2026-03-01'),
  ('Hardening de servidores Linux', 'Segurança', 'Checklist de segurança para endurecimento de servidores Ubuntu e CentOS.', 'Kimberly Sousa', 298, 39, ARRAY['segurança','linux','hardening','servidor'], '2026-04-10');
