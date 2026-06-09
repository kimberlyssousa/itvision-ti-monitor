/*
  # Fix RLS policies for public/anon access

  The app uses the anon key without authentication.
  Current policies only allow authenticated users, which blocks all reads and writes.

  1. Changes
    - Drop existing SELECT-only policies for authenticated users
    - Add SELECT policies for anon users (public read)
    - Add INSERT policies for anon users (public create)
    - Add UPDATE policies for anon users (public update)
    - Add DELETE policies for anon users (public delete)
  
  2. Tables affected
    - chamados
    - ativos
    - alertas

  3. Security note
    - This app currently operates without user authentication
    - Once auth is added, these policies should be tightened
*/

-- ===== CHAMADOS =====
DROP POLICY IF EXISTS "Chamados readable by authenticated users" ON chamados;

CREATE POLICY "Chamados public read"
  ON chamados FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Chamados public insert"
  ON chamados FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Chamados public update"
  ON chamados FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Chamados public delete"
  ON chamados FOR DELETE
  TO anon, authenticated
  USING (true);

-- ===== ATIVOS =====
DROP POLICY IF EXISTS "Ativos readable by authenticated users" ON ativos;

CREATE POLICY "Ativos public read"
  ON ativos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Ativos public insert"
  ON ativos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Ativos public update"
  ON ativos FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Ativos public delete"
  ON ativos FOR DELETE
  TO anon, authenticated
  USING (true);

-- ===== ALERTAS =====
DROP POLICY IF EXISTS "Alertas readable by authenticated users" ON alertas;

CREATE POLICY "Alertas public read"
  ON alertas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Alertas public insert"
  ON alertas FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Alertas public update"
  ON alertas FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Alertas public delete"
  ON alertas FOR DELETE
  TO anon, authenticated
  USING (true);
