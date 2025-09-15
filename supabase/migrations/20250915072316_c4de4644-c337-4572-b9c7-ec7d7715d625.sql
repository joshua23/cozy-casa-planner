-- 直接为现有项目手动创建阶段，使用简单的INSERT语句
INSERT INTO project_phases (project_id, phase_name, phase_order, estimated_duration, status, description) 
SELECT 
    '6599a87f-7400-4479-a6b1-f2f13ab71816'::uuid,
    phase_data.phase_name,
    phase_data.phase_order,
    phase_data.estimated_duration,
    '未开始'::text,
    phase_data.description
FROM (VALUES
    ('跟进洽谈', 1, 3, '项目前期沟通、需求确认、合同签订等'),
    ('设计阶段', 2, 14, '量房、设计方案、效果图制作、方案确认'),
    ('拆除阶段', 3, 3, '原有装修拆除、垃圾清理'),
    ('水电改造', 4, 7, '水电线路改造、开槽布线'),
    ('泥瓦工程', 5, 10, '防水、贴砖、地面找平等'),
    ('木工阶段', 6, 12, '吊顶、柜体制作、木工装饰'),
    ('油漆涂料', 7, 8, '墙面处理、刷漆、贴壁纸'),
    ('安装阶段', 8, 5, '灯具、开关插座、洁具安装'),
    ('软装配饰', 9, 3, '家具摆放、装饰品安装'),
    ('收尾阶段', 10, 2, '清洁、验收、整改'),
    ('已完工', 11, 1, '项目交付、售后服务')
) AS phase_data(phase_name, phase_order, estimated_duration, description);