-- 为匿名用户添加RLS策略，允许基本CRUD操作
-- 这是一个简单的策略，生产环境需要更严格的权限控制

-- Projects表策略
CREATE POLICY "Allow anonymous access to projects" ON projects
    FOR ALL USING (true) WITH CHECK (true);

-- Payment nodes表策略
CREATE POLICY "Allow anonymous access to payment_nodes" ON payment_nodes
    FOR ALL USING (true) WITH CHECK (true);

-- Project phases表策略
CREATE POLICY "Allow anonymous access to project_phases" ON project_phases
    FOR ALL USING (true) WITH CHECK (true);

-- Customers表策略
CREATE POLICY "Allow anonymous access to customers" ON customers
    FOR ALL USING (true) WITH CHECK (true);

-- Workers表策略
CREATE POLICY "Allow anonymous access to workers" ON workers
    FOR ALL USING (true) WITH CHECK (true);

-- Construction teams表策略
CREATE POLICY "Allow anonymous access to construction_teams" ON construction_teams
    FOR ALL USING (true) WITH CHECK (true);

-- Materials表策略
CREATE POLICY "Allow anonymous access to materials" ON materials
    FOR ALL USING (true) WITH CHECK (true);

-- Material transactions表策略
CREATE POLICY "Allow anonymous access to material_transactions" ON material_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- Financial records表策略
CREATE POLICY "Allow anonymous access to financial_records" ON financial_records
    FOR ALL USING (true) WITH CHECK (true);

-- Talents表策略
CREATE POLICY "Allow anonymous access to talents" ON talents
    FOR ALL USING (true) WITH CHECK (true);

-- Team assignments表策略
CREATE POLICY "Allow anonymous access to team_assignments" ON team_assignments
    FOR ALL USING (true) WITH CHECK (true);

-- Worker assignments表策略
CREATE POLICY "Allow anonymous access to worker_assignments" ON worker_assignments
    FOR ALL USING (true) WITH CHECK (true);