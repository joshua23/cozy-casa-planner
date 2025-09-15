-- 直接修改现有表结构，不插入模板数据
ALTER TABLE project_phases 
ADD COLUMN IF NOT EXISTS phase_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS actual_start_date DATE,
ADD COLUMN IF NOT EXISTS actual_end_date DATE,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS dependencies TEXT[],
ADD COLUMN IF NOT EXISTS progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100);

-- 创建函数：为新项目自动创建默认阶段
CREATE OR REPLACE FUNCTION create_default_project_phases()
RETURNS TRIGGER AS $$
BEGIN
  -- 为新项目创建默认阶段
  INSERT INTO project_phases (project_id, phase_name, phase_order, estimated_duration, status, description) VALUES
    (NEW.id, '跟进洽谈', 1, 3, '未开始', '项目前期沟通、需求确认、合同签订等'),
    (NEW.id, '设计阶段', 2, 14, '未开始', '量房、设计方案、效果图制作、方案确认'),
    (NEW.id, '拆除阶段', 3, 3, '未开始', '原有装修拆除、垃圾清理'),
    (NEW.id, '水电改造', 4, 7, '未开始', '水电线路改造、开槽布线'),
    (NEW.id, '泥瓦工程', 5, 10, '未开始', '防水、贴砖、地面找平等'),
    (NEW.id, '木工阶段', 6, 12, '未开始', '吊顶、柜体制作、木工装饰'),
    (NEW.id, '油漆涂料', 7, 8, '未开始', '墙面处理、刷漆、贴壁纸'),
    (NEW.id, '安装阶段', 8, 5, '未开始', '灯具、开关插座、洁具安装'),
    (NEW.id, '软装配饰', 9, 3, '未开始', '家具摆放、装饰品安装'),
    (NEW.id, '收尾阶段', 10, 2, '未开始', '清洁、验收、整改'),
    (NEW.id, '已完工', 11, 1, '未开始', '项目交付、售后服务');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 创建触发器
DROP TRIGGER IF EXISTS on_project_created ON projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION create_default_project_phases();