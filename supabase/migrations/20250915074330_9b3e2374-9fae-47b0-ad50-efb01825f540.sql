-- 清理重复的项目阶段数据
-- 为每个项目和阶段组合保留最早创建的记录，删除其他重复记录

DELETE FROM project_phases 
WHERE id NOT IN (
  SELECT DISTINCT ON (project_id, phase_name, phase_order) id
  FROM project_phases 
  ORDER BY project_id, phase_name, phase_order, created_at ASC
);

-- 添加唯一约束防止未来的重复
ALTER TABLE project_phases 
ADD CONSTRAINT unique_project_phase_order 
UNIQUE (project_id, phase_order);

-- 添加另一个唯一约束防止相同项目中同名阶段的重复
ALTER TABLE project_phases 
ADD CONSTRAINT unique_project_phase_name 
UNIQUE (project_id, phase_name);

-- 修改触发器函数，添加冲突处理
CREATE OR REPLACE FUNCTION public.create_default_project_phases()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- 检查是否已经存在阶段，如果存在则跳过创建
  IF EXISTS (SELECT 1 FROM project_phases WHERE project_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- 为新项目创建默认阶段，使用ON CONFLICT处理可能的重复
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
    (NEW.id, '已完工', 11, 1, '未开始', '项目交付、售后服务')
  ON CONFLICT (project_id, phase_order) DO NOTHING;
  
  RETURN NEW;
END;
$function$;