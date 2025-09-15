/*
  # 以Client为核心的系统优化
  
  目标：统一客户概念，以projects表中的client信息为核心，优化整个系统的客户管理
  
  1. 数据结构优化
    - 强化projects表作为client信息的主要载体
    - 重新定义customers表的作用（潜在客户 vs 已签约客户）
    - 优化财务记录与client的关联
  
  2. 业务逻辑优化
    - projects表的client字段 = 已签约客户（正式客户）
    - customers表 = 潜在客户/线索管理
    - 所有业务统计以projects.client为基准
  
  3. 数据视图创建
    - 创建client聚合视图，便于统计分析
    - 客户生命周期管理（潜在→洽谈→签约→完成）
*/

-- 1. 优化projects表，增强client信息管理
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS client_id UUID DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN IF NOT EXISTS client_status TEXT DEFAULT '已签约' CHECK (client_status IN ('洽谈中', '已签约', '已完成', '暂停合作')),
ADD COLUMN IF NOT EXISTS client_source TEXT CHECK (client_source IN ('网络推广', '朋友推荐', '老客户介绍', '展会', '其他')),
ADD COLUMN IF NOT EXISTS client_address TEXT,
ADD COLUMN IF NOT EXISTS client_wechat TEXT,
ADD COLUMN IF NOT EXISTS contract_signed_date DATE,
ADD COLUMN IF NOT EXISTS client_notes TEXT;

-- 2. 重新定义customers表为"潜在客户/线索管理"
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS converted_to_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS conversion_date DATE,
ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0;

-- 为customers表添加注释说明其用途
COMMENT ON TABLE public.customers IS '潜在客户和线索管理表，用于跟进未签约的客户';
COMMENT ON COLUMN public.customers.converted_to_project_id IS '转化为正式项目的ID，标记客户转化情况';
COMMENT ON TABLE public.projects IS '正式签约项目表，client字段为已签约客户信息';

-- 3. 创建客户聚合视图 - 统一展示所有客户信息
CREATE OR REPLACE VIEW public.clients_unified AS
SELECT 
  -- 正式客户（来自projects表）
  p.client_id as id,
  p.client_name as name,
  p.client_phone as phone,
  p.client_email as email,
  p.client_address as address,
  p.client_wechat as wechat,
  p.client_status as status,
  p.client_source as source,
  '正式客户' as client_type,
  p.id as project_id,
  p.name as project_name,
  p.total_contract_amount,
  p.status as project_status,
  p.created_at,
  p.user_id,
  -- 统计信息
  (
    SELECT COUNT(*) 
    FROM public.projects p2 
    WHERE p2.client_name = p.client_name 
      AND p2.client_phone = p.client_phone
      AND p2.user_id = p.user_id
  ) as total_projects,
  (
    SELECT SUM(total_contract_amount) 
    FROM public.projects p3 
    WHERE p3.client_name = p.client_name 
      AND p3.client_phone = p.client_phone
      AND p3.user_id = p.user_id
  ) as total_contract_value
FROM public.projects p
WHERE p.client_name IS NOT NULL

UNION ALL

SELECT 
  -- 潜在客户（来自customers表，未转化的）
  c.id,
  c.name,
  c.phone,
  c.email,
  NULL as address,
  NULL as wechat,
  c.status,
  NULL as source,
  '潜在客户' as client_type,
  c.converted_to_project_id as project_id,
  NULL as project_name,
  c.preliminary_budget as total_contract_amount,
  NULL as project_status,
  c.created_at,
  c.user_id,
  0 as total_projects,
  0 as total_contract_value
FROM public.customers c
WHERE c.converted_to_project_id IS NULL;

-- 4. 为视图启用RLS
ALTER VIEW public.clients_unified SET (security_invoker = true);

-- 5. 创建RLS策略
CREATE POLICY "Users can view their unified clients" 
ON public.clients_unified 
FOR SELECT 
USING (auth.uid() = user_id);

-- 6. 优化财务记录与client的关联
-- 创建函数：自动从project获取client信息
CREATE OR REPLACE FUNCTION public.auto_sync_client_info()
RETURNS TRIGGER AS $$
BEGIN
  -- 当财务记录关联项目时，自动同步client信息
  IF NEW.project_id IS NOT NULL THEN
    UPDATE public.financial_records 
    SET 
      customer_name = p.client_name,
      project_name = p.name,
      customer_id = p.client_id
    FROM public.projects p 
    WHERE p.id = NEW.project_id 
      AND public.financial_records.id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 更新现有触发器
DROP TRIGGER IF EXISTS auto_fill_customer_info ON public.financial_records;
DROP TRIGGER IF EXISTS auto_sync_client_info ON public.financial_records;

CREATE TRIGGER auto_sync_client_info
  AFTER INSERT OR UPDATE ON public.financial_records
  FOR EACH ROW EXECUTE FUNCTION public.auto_sync_client_info();

-- 7. 创建客户转化函数（潜在客户→正式客户）
CREATE OR REPLACE FUNCTION public.convert_customer_to_client(
  customer_id UUID,
  project_name TEXT,
  contract_amount DECIMAL,
  start_date DATE DEFAULT CURRENT_DATE
) RETURNS UUID AS $$
DECLARE
  new_project_id UUID;
  customer_record RECORD;
BEGIN
  -- 获取客户信息
  SELECT * INTO customer_record 
  FROM public.customers 
  WHERE id = customer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer not found';
  END IF;
  
  -- 创建新项目（正式客户）
  INSERT INTO public.projects (
    name,
    client_name,
    client_phone,
    client_email,
    status,
    total_contract_amount,
    start_date,
    property_type,
    decoration_style,
    user_id,
    client_status,
    contract_signed_date
  ) VALUES (
    project_name,
    customer_record.name,
    customer_record.phone,
    customer_record.email,
    '设计中',
    contract_amount,
    start_date,
    customer_record.property_type,
    customer_record.decoration_style,
    customer_record.user_id,
    '已签约',
    CURRENT_DATE
  ) RETURNING id INTO new_project_id;
  
  -- 更新客户记录，标记为已转化
  UPDATE public.customers 
  SET 
    converted_to_project_id = new_project_id,
    conversion_date = CURRENT_DATE,
    status = '已签约'
  WHERE id = customer_id;
  
  RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. 创建客户统计函数
CREATE OR REPLACE FUNCTION public.get_client_stats(user_uuid UUID)
RETURNS TABLE(
  total_clients BIGINT,
  active_projects BIGINT,
  completed_projects BIGINT,
  total_revenue DECIMAL,
  potential_clients BIGINT,
  conversion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- 总客户数（正式客户）
    (SELECT COUNT(DISTINCT client_name) FROM public.projects WHERE user_id = user_uuid AND client_name IS NOT NULL),
    -- 进行中项目数
    (SELECT COUNT(*) FROM public.projects WHERE user_id = user_uuid AND status IN ('设计中', '进行中')),
    -- 已完成项目数  
    (SELECT COUNT(*) FROM public.projects WHERE user_id = user_uuid AND status = '已完成'),
    -- 总收入
    (SELECT COALESCE(SUM(total_contract_amount), 0) FROM public.projects WHERE user_id = user_uuid),
    -- 潜在客户数
    (SELECT COUNT(*) FROM public.customers WHERE user_id = user_uuid AND converted_to_project_id IS NULL),
    -- 转化率
    CASE 
      WHEN (SELECT COUNT(*) FROM public.customers WHERE user_id = user_uuid) > 0 THEN
        (SELECT COUNT(*) FROM public.customers WHERE user_id = user_uuid AND converted_to_project_id IS NOT NULL)::DECIMAL / 
        (SELECT COUNT(*) FROM public.customers WHERE user_id = user_uuid)::DECIMAL * 100
      ELSE 0
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. 更新现有数据，确保client_id唯一性
UPDATE public.projects 
SET client_id = gen_random_uuid() 
WHERE client_id IS NULL;

-- 10. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_projects_client_name ON public.projects(client_name);
CREATE INDEX IF NOT EXISTS idx_projects_client_phone ON public.projects(client_phone);
CREATE INDEX IF NOT EXISTS idx_projects_client_status ON public.projects(client_status);
CREATE INDEX IF NOT EXISTS idx_customers_conversion ON public.customers(converted_to_project_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_customer_id ON public.financial_records(customer_id);
