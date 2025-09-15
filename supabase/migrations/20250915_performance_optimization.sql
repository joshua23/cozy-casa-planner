-- 数据库性能优化脚本
-- 添加关键索引提升查询性能

-- 1. 项目表索引优化
-- 用于Dashboard统计和项目列表查询
CREATE INDEX IF NOT EXISTS idx_projects_user_status
ON projects(user_id, status);

CREATE INDEX IF NOT EXISTS idx_projects_user_created
ON projects(user_id, created_at DESC);

-- 2. 付款节点表索引优化
-- 用于项目详情页和财务统计
CREATE INDEX IF NOT EXISTS idx_payment_nodes_project_status
ON payment_nodes(project_id, status);

CREATE INDEX IF NOT EXISTS idx_payment_nodes_user_date
ON payment_nodes(user_id, created_at DESC);

-- 3. 项目阶段表索引优化
-- 用于项目进度显示和甘特图
CREATE INDEX IF NOT EXISTS idx_project_phases_project_order
ON project_phases(project_id, phase_order);

CREATE INDEX IF NOT EXISTS idx_project_phases_user_status
ON project_phases(user_id, status);

-- 4. 财务记录表索引优化
-- 用于Dashboard财务统计和报表
CREATE INDEX IF NOT EXISTS idx_financial_records_user_date
ON financial_records(user_id, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_financial_records_user_type_date
ON financial_records(user_id, transaction_type, transaction_date DESC);

-- 5. 工人分配表索引优化
-- 用于工人管理页面显示分配项目
CREATE INDEX IF NOT EXISTS idx_worker_assignments_worker_status
ON worker_assignments(worker_id, status);

CREATE INDEX IF NOT EXISTS idx_worker_assignments_project_status
ON worker_assignments(project_id, status);

-- 6. 团队分配表索引优化
-- 用于团队管理页面
CREATE INDEX IF NOT EXISTS idx_team_assignments_team_status
ON team_assignments(team_id, status);

-- 7. 客户表索引优化
-- 用于客户管理和搜索
CREATE INDEX IF NOT EXISTS idx_customers_user_status
ON customers(user_id, status);

CREATE INDEX IF NOT EXISTS idx_customers_user_created
ON customers(user_id, created_at DESC);

-- 8. 材料库存表索引优化
-- 用于材料管理和库存报警
CREATE INDEX IF NOT EXISTS idx_materials_user_stock
ON materials(user_id, current_stock);

CREATE INDEX IF NOT EXISTS idx_materials_user_category
ON materials(user_id, category);

-- 9. 工人表索引优化
-- 用于工人管理和搜索
CREATE INDEX IF NOT EXISTS idx_workers_user_status
ON workers(user_id, status);

CREATE INDEX IF NOT EXISTS idx_workers_user_type
ON workers(user_id, worker_type);

-- 10. 供应商表索引优化
-- 用于供应商管理
CREATE INDEX IF NOT EXISTS idx_suppliers_user_status
ON suppliers(user_id, status);

-- 添加索引完成后的性能分析注释
COMMENT ON INDEX idx_projects_user_status IS '优化项目列表查询和状态统计';
COMMENT ON INDEX idx_payment_nodes_project_status IS '优化项目付款节点查询';
COMMENT ON INDEX idx_financial_records_user_date IS '优化财务报表和统计查询';
COMMENT ON INDEX idx_worker_assignments_worker_status IS '优化工人项目分配查询';

-- 查询性能统计视图（可选）
-- 用于监控查询性能
CREATE OR REPLACE VIEW performance_stats AS
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'payment_nodes', 'project_phases', 'financial_records', 'worker_assignments')
ORDER BY tablename, attname;