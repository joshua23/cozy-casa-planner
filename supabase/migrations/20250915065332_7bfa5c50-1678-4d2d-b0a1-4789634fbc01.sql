-- 删除有问题的列，重新创建
ALTER TABLE project_phases DROP COLUMN IF EXISTS status;

-- 添加新的状态列
ALTER TABLE project_phases ADD COLUMN status TEXT DEFAULT '未开始' CHECK (status IN ('未开始', '进行中', '已完成', '暂停'));

-- 添加其他新字段
ALTER TABLE project_phases 
ADD COLUMN IF NOT EXISTS phase_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS actual_start_date DATE,
ADD COLUMN IF NOT EXISTS actual_end_date DATE,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS dependencies TEXT[],
ADD COLUMN IF NOT EXISTS progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100);

-- 更新现有记录
UPDATE project_phases SET status = '未开始' WHERE status IS NULL;

-- 创建默认项目阶段模板（使用一个虚拟的project_id）
INSERT INTO project_phases (project_id, phase_name, phase_order, estimated_duration, status, description) VALUES
  ('00000000-0000-0000-0000-000000000000', '跟进洽谈', 1, 3, '未开始', '项目前期沟通、需求确认、合同签订等'),
  ('00000000-0000-0000-0000-000000000000', '设计阶段', 2, 14, '未开始', '量房、设计方案、效果图制作、方案确认'),
  ('00000000-0000-0000-0000-000000000000', '拆除阶段', 3, 3, '未开始', '原有装修拆除、垃圾清理'),
  ('00000000-0000-0000-0000-000000000000', '水电改造', 4, 7, '未开始', '水电线路改造、开槽布线'),
  ('00000000-0000-0000-0000-000000000000', '泥瓦工程', 5, 10, '未开始', '防水、贴砖、地面找平等'),
  ('00000000-0000-0000-0000-000000000000', '木工阶段', 6, 12, '未开始', '吊顶、柜体制作、木工装饰'),
  ('00000000-0000-0000-0000-000000000000', '油漆涂料', 7, 8, '未开始', '墙面处理、刷漆、贴壁纸'),
  ('00000000-0000-0000-0000-000000000000', '安装阶段', 8, 5, '未开始', '灯具、开关插座、洁具安装'),
  ('00000000-0000-0000-0000-000000000000', '软装配饰', 9, 3, '未开始', '家具摆放、装饰品安装'),
  ('00000000-0000-0000-0000-000000000000', '收尾阶段', 10, 2, '未开始', '清洁、验收、整改'),
  ('00000000-0000-0000-0000-000000000000', '已完工', 11, 1, '未开始', '项目交付、售后服务')
ON CONFLICT (project_id, phase_name) DO NOTHING;