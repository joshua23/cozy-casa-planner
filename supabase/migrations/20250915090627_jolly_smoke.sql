/*
  # 增强财务记录关联性

  1. 数据库结构更新
    - 为 financial_records 表添加客户关联字段
    - 添加更详细的交易信息字段
    - 创建财务记录与项目、客户的关联视图

  2. 安全策略
    - 更新 RLS 策略以支持新的关联字段
    - 确保数据访问权限正确

  3. 功能增强
    - 支持按项目和客户筛选财务记录
    - 提供更详细的财务分析
*/

-- 为财务记录表添加客户关联和更多详细信息
ALTER TABLE public.financial_records 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS project_name TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT '已完成' CHECK (payment_status IN ('待处理', '处理中', '已完成', '已取消')),
ADD COLUMN IF NOT EXISTS operator_name TEXT,
ADD COLUMN IF NOT EXISTS approver_name TEXT,
ADD COLUMN IF NOT EXISTS invoice_url TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 创建财务记录详细视图，包含项目和客户信息
CREATE OR REPLACE VIEW public.financial_records_detailed AS
SELECT 
  fr.*,
  p.name as project_display_name,
  p.client_name as project_client_name,
  p.client_phone as project_client_phone,
  p.project_address,
  c.name as customer_display_name,
  c.phone as customer_phone,
  c.email as customer_email,
  c.status as customer_status
FROM public.financial_records fr
LEFT JOIN public.projects p ON fr.project_id = p.id
LEFT JOIN public.customers c ON fr.customer_id = c.id;

-- 为视图启用RLS
ALTER VIEW public.financial_records_detailed SET (security_invoker = true);

-- 创建RLS策略允许用户查看详细财务记录视图
CREATE POLICY "Users can view their detailed financial records" 
ON public.financial_records_detailed 
FOR SELECT 
USING (auth.uid() = user_id);

-- 创建函数：根据项目ID自动填充客户信息
CREATE OR REPLACE FUNCTION public.auto_fill_customer_from_project()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果设置了project_id但没有设置customer信息，自动从项目中获取
  IF NEW.project_id IS NOT NULL AND (NEW.customer_name IS NULL OR NEW.customer_name = '') THEN
    SELECT 
      p.client_name,
      p.name
    INTO 
      NEW.customer_name,
      NEW.project_name
    FROM public.projects p 
    WHERE p.id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 创建触发器
DROP TRIGGER IF EXISTS auto_fill_customer_info ON public.financial_records;
CREATE TRIGGER auto_fill_customer_info
  BEFORE INSERT OR UPDATE ON public.financial_records
  FOR EACH ROW EXECUTE FUNCTION public.auto_fill_customer_from_project();

-- 更新现有记录，为没有关联信息的记录尝试自动关联
UPDATE public.financial_records 
SET 
  customer_name = p.client_name,
  project_name = p.name
FROM public.projects p 
WHERE financial_records.project_id = p.id 
  AND (financial_records.customer_name IS NULL OR financial_records.customer_name = '');