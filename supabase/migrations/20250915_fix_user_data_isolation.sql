-- 修复用户数据隔离问题的迁移脚本
-- 为历史数据补充缺失的user_id字段

-- 1. 创建临时函数来获取第一个管理员用户ID（作为历史数据的默认所有者）
DO $$
DECLARE
    default_user_id uuid;
BEGIN
    -- 获取第一个用户作为默认所有者（假设是系统管理员）
    SELECT id INTO default_user_id
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;

    IF default_user_id IS NOT NULL THEN
        -- 2. 更新缺失user_id的财务记录
        UPDATE financial_records
        SET user_id = default_user_id
        WHERE user_id IS NULL;

        -- 3. 更新缺失user_id的工人记录
        UPDATE workers
        SET user_id = default_user_id
        WHERE user_id IS NULL;

        -- 4. 更新缺失user_id的付款节点（通过项目关联）
        UPDATE payment_nodes
        SET user_id = p.user_id
        FROM projects p
        WHERE payment_nodes.project_id = p.id
        AND payment_nodes.user_id IS NULL;

        -- 5. 更新缺失user_id的项目阶段（通过项目关联）
        UPDATE project_phases
        SET user_id = p.user_id
        FROM projects p
        WHERE project_phases.project_id = p.id
        AND project_phases.user_id IS NULL;

        -- 6. 更新缺失user_id的工人分配记录
        UPDATE worker_assignments
        SET user_id = p.user_id
        FROM projects p
        WHERE worker_assignments.project_id = p.id
        AND worker_assignments.user_id IS NULL;

        -- 7. 更新缺失user_id的团队分配记录
        UPDATE team_assignments
        SET user_id = p.user_id
        FROM projects p
        WHERE team_assignments.project_id = p.id
        AND team_assignments.user_id IS NULL;

        RAISE NOTICE '历史数据user_id修复完成，默认所有者: %', default_user_id;
    ELSE
        RAISE NOTICE '未找到用户，跳过历史数据修复';
    END IF;
END $$;

-- 8. 添加NOT NULL约束确保未来数据完整性
-- 注意：在生产环境中，这些约束应该在确认数据清理完成后再添加

-- ALTER TABLE financial_records ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE workers ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE payment_nodes ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE project_phases ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE worker_assignments ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE team_assignments ALTER COLUMN user_id SET NOT NULL;

-- 9. 创建RLS策略确保数据安全
-- 启用行级安全
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_assignments ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：用户只能访问自己的数据
CREATE POLICY "Users can only access their own financial records" ON financial_records
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own workers" ON workers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own payment nodes" ON payment_nodes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own project phases" ON project_phases
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own worker assignments" ON worker_assignments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own team assignments" ON team_assignments
    FOR ALL USING (auth.uid() = user_id);

-- 10. 添加性能监控功能
-- 创建查询性能监控视图
CREATE OR REPLACE VIEW query_performance_monitor AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

COMMENT ON VIEW query_performance_monitor IS '查询性能监控视图，用于跟踪索引使用情况';