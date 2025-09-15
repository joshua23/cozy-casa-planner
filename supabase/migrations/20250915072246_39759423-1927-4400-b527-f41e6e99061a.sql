-- 为所有现有项目创建默认阶段（如果还没有阶段的话）
DO $$
DECLARE
    project_record RECORD;
BEGIN
    -- 遍历所有没有阶段的项目
    FOR project_record IN 
        SELECT p.id 
        FROM projects p 
        LEFT JOIN project_phases ph ON p.id = ph.project_id 
        WHERE ph.id IS NULL
    LOOP
        -- 为每个项目创建默认阶段
        INSERT INTO project_phases (project_id, phase_name, phase_order, estimated_duration, status, description) VALUES
            (project_record.id, '跟进洽谈', 1, 3, '未开始', '项目前期沟通、需求确认、合同签订等'),
            (project_record.id, '设计阶段', 2, 14, '未开始', '量房、设计方案、效果图制作、方案确认'),
            (project_record.id, '拆除阶段', 3, 3, '未开始', '原有装修拆除、垃圾清理'),
            (project_record.id, '水电改造', 4, 7, '未开始', '水电线路改造、开槽布线'),
            (project_record.id, '泥瓦工程', 5, 10, '未开始', '防水、贴砖、地面找平等'),
            (project_record.id, '木工阶段', 6, 12, '未开始', '吊顶、柜体制作、木工装饰'),
            (project_record.id, '油漆涂料', 7, 8, '未开始', '墙面处理、刷漆、贴壁纸'),
            (project_record.id, '安装阶段', 8, 5, '未开始', '灯具、开关插座、洁具安装'),
            (project_record.id, '软装配饰', 9, 3, '未开始', '家具摆放、装饰品安装'),
            (project_record.id, '收尾阶段', 10, 2, '未开始', '清洁、验收、整改'),
            (project_record.id, '已完工', 11, 1, '未开始', '项目交付、售后服务');
        
        RAISE NOTICE '已为项目 % 创建默认阶段', project_record.id;
    END LOOP;
END;
$$;