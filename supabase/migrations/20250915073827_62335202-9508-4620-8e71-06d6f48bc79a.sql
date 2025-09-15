-- 删除可能存在的phase_name检查约束，因为它阻止了中文阶段名称的插入
ALTER TABLE project_phases DROP CONSTRAINT IF EXISTS project_phases_phase_name_check;

-- 确保project_phases表可以接受中文阶段名称
-- 如果需要约束，我们可以添加一个更合适的约束，但现在先移除限制性约束