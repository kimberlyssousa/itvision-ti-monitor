/*
  # Create usuarios table

  1. New Tables
    - `usuarios`
      - id (uuid, primary key)
      - nome (text, not null)
      - email (text, unique, not null)
      - senha (text, not null) - plain text for simple auth
      - cargo (text)
      - avatar (text) - initials
      - ativo (boolean, default true)
      - criado_em (timestamptz, default now())

  2. Security
    - RLS enabled on usuarios table
    - Public read/insert for anon (login requires reading user data)
    - Note: senha is stored as plain text per user requirement
    - When full auth is implemented, this should migrate to Supabase Auth

  3. Initial Data
    - admin@itvision.com.br / admin123 (Kimberly Sousa - Admin)
    - felipe.costa@itvision.com.br / felipe123 (Felipe Costa - Técnico)
    - beatriz.santos@itvision.com.br / beatriz123 (Beatriz Santos - Analista)
    - lucas.oliveira@itvision.com.br / lucas123 (Lucas Oliveira - Suporte)
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha text NOT NULL,
  cargo text DEFAULT '',
  avatar text DEFAULT '',
  ativo boolean DEFAULT true,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios public read"
  ON usuarios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Usuarios public insert"
  ON usuarios FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios public update"
  ON usuarios FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Initial users
INSERT INTO usuarios (nome, email, senha, cargo, avatar) VALUES
  ('Kimberly Sousa', 'admin@itvision.com.br', 'admin123', 'Analista de TI Sênior', 'KS'),
  ('Felipe Costa', 'felipe.costa@itvision.com.br', 'felipe123', 'Técnico de Rede', 'FC'),
  ('Beatriz Santos', 'beatriz.santos@itvision.com.br', 'beatriz123', 'Analista de Sistemas', 'BS'),
  ('Lucas Oliveira', 'lucas.oliveira@itvision.com.br', 'lucas123', 'Suporte N1', 'LO');
