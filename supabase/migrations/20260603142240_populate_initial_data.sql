/*
  # Populate Initial Data
  
  Inserts sample tickets, assets and alerts into IT Vision tables
*/

-- Insert sample chamados (tickets)
INSERT INTO chamados (titulo, descricao, status, prioridade, categoria, solicitante, atribuido, sla_vencimento, sla_cumprido) VALUES
('Servidor de produção fora do ar', 'O servidor principal de produção (SRV-PROD-01) parou de responder. Todos os serviços dependentes estão inacessíveis.', 'em_andamento', 'critica', 'Infraestrutura', 'Carlos Mendes', 'Kimberly Sousa', NOW() + INTERVAL '3 hours', false),
('VPN não conecta para usuários remotos', 'Usuários do setor financeiro relatam que a VPN retorna erro de autenticação desde às 07h.', 'em_andamento', 'alta', 'Rede', 'Ana Paula Lima', 'Felipe Costa', NOW() + INTERVAL '6 hours', true),
('Impressora do RH não imprime', 'A impressora HP LaserJet do setor de RH não responde a comandos de impressão.', 'aberto', 'media', 'Hardware', 'Mariana Ferreira', NULL, NOW() + INTERVAL '24 hours', true),
('Lentidão no sistema ERP', 'O sistema ERP está com lentidão excessiva. Consultas que levavam 2s agora demoram mais de 30s.', 'aberto', 'alta', 'Software', 'Roberto Alves', 'Beatriz Santos', NOW() + INTERVAL '7 hours', true),
('Solicitação de novo notebook', 'Novo colaborador do setor de TI precisa de notebook para início das atividades.', 'aguardando', 'baixa', 'Aquisição', 'Gestão de Pessoas', 'Lucas Oliveira', NOW() + INTERVAL '5 days', true),
('Email corporativo bloqueado', 'Usuário João Silva não consegue acessar o email corporativo. Senha expirada.', 'resolvido', 'media', 'Acesso', 'João Silva', 'Felipe Costa', NOW() + INTERVAL '1 day', true),
('Switch do andar 3 com falha', 'Switch Cisco Catalyst do 3º andar está reiniciando a cada 20 minutos, causando quedas de conectividade.', 'em_andamento', 'critica', 'Rede', 'Operações', 'Kimberly Sousa', NOW() + INTERVAL '1 hour', false),
('Backup não executou ontem', 'O job de backup noturno falhou. Nenhum arquivo foi salvo no storage S3.', 'aberto', 'alta', 'Backup', 'Sistema Automatizado', 'Beatriz Santos', NOW() + INTERVAL '5 hours', true);

-- Insert sample ativos (assets)
INSERT INTO ativos (nome, tipo, ip, mac, sistema, localizacao, responsavel, status, cpu_uso, memoria_uso, disco_uso, ultimo_ping, adquirido_em, garantia_ate) VALUES
('SRV-PROD-01', 'servidor', '10.0.1.10', '00:1A:2B:3C:4D:5E', 'Ubuntu Server 22.04 LTS', 'Data Center - Rack A1', 'Kimberly Sousa', 'offline', 0, 0, 78, NOW() - INTERVAL '22 minutes', '2022-03-15', '2027-03-15'),
('SRV-DB-01', 'servidor', '10.0.1.11', '00:1A:2B:3C:4D:5F', 'Windows Server 2022', 'Data Center - Rack A2', 'Kimberly Sousa', 'online', 45, 67, 55, NOW(), '2022-03-15', '2027-03-15'),
('SRV-WEB-01', 'servidor', '10.0.1.12', '00:1A:2B:3C:4D:60', 'CentOS Stream 9', 'Data Center - Rack B1', 'Felipe Costa', 'online', 23, 41, 38, NOW(), '2023-01-20', '2028-01-20'),
('SW-CORE-01', 'switch', '10.0.0.1', 'AA:BB:CC:DD:EE:01', 'Cisco IOS 16.12', 'Data Center - Rack C1', 'Felipe Costa', 'online', 12, 28, 10, NOW(), '2021-06-10', '2026-06-10'),
('SW-ANDAR3-01', 'switch', '10.0.3.1', 'AA:BB:CC:DD:EE:02', 'Cisco IOS 15.2', '3º Andar - Rack D1', 'Felipe Costa', 'manutencao', 0, 0, 5, NOW() - INTERVAL '3 hours', '2019-11-05', '2024-11-05'),
('NB-DEV-MARIA', 'notebook', '10.0.5.45', 'CC:DD:EE:FF:00:11', 'macOS Sonoma 14.4', 'TI - Mesa 12', 'Maria Oliveira', 'online', 34, 72, 61, NOW() - INTERVAL '1 minute', '2024-02-01', '2027-02-01'),
('FW-EDGE-01', 'firewall', '192.168.0.1', 'FF:EE:DD:CC:BB:01', 'pfSense 2.7.2', 'Data Center - Rack C2', 'Kimberly Sousa', 'online', 8, 15, 22, NOW(), '2023-07-01', '2028-07-01'),
('RT-BORDER-01', 'roteador', '192.168.0.2', 'FF:EE:DD:CC:BB:02', 'Cisco IOS-XE 17.6', 'Data Center - Rack C3', 'Felipe Costa', 'online', 5, 20, 8, NOW(), '2022-09-12', '2027-09-12');

-- Insert sample alertas (alerts)
INSERT INTO alertas (ativo_id, tipo, mensagem) 
SELECT id, 'critico', 'Host não responde ao ping' FROM ativos WHERE nome = 'SRV-PROD-01'
UNION ALL
SELECT id, 'critico', 'Interface down: GigabitEthernet0/1' FROM ativos WHERE nome = 'SW-ANDAR3-01'
UNION ALL
SELECT id, 'aviso', 'Uso de memória acima de 65%' FROM ativos WHERE nome = 'SRV-DB-01'
UNION ALL
SELECT id, 'aviso', 'Uso de memória acima de 70%' FROM ativos WHERE nome = 'NB-DEV-MARIA'
UNION ALL
SELECT id, 'info', 'Regra de firewall atualizada' FROM ativos WHERE nome = 'FW-EDGE-01';
