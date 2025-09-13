-- 创建项目表
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  status TEXT NOT NULL DEFAULT '待开工' CHECK (status IN ('待开工', '设计中', '进行中', '已完成', '暂停')),
  total_contract_amount DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  property_type TEXT CHECK (property_type IN ('平层', '小商品', '别墅', '办公室', '商业空间')),
  decoration_style TEXT,
  area DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建付款节点表
CREATE TABLE public.payment_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL CHECK (node_type IN ('合同总价', '定金', '一期工程款', '二期工程款', '三期工程款', '增项款', '尾款')),
  amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  due_date DATE,
  status TEXT NOT NULL DEFAULT '未付' CHECK (status IN ('未付', '部分', '已付')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建项目进度节点表
CREATE TABLE public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_name TEXT NOT NULL CHECK (phase_name IN ('拆除阶段', '水电阶段', '泥工阶段', '木工阶段', '油漆阶段', '保洁阶段', '收尾阶段')),
  status TEXT NOT NULL DEFAULT '未开始' CHECK (status IN ('未开始', '进行中', '已完成')),
  start_date DATE,
  end_date DATE,
  completion_percentage INT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建客户表
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT '潜在' CHECK (status IN ('潜在', '洽谈中', '已签约', '已完成', '流失')),
  preliminary_budget DECIMAL(12,2),
  decoration_style TEXT,
  property_type TEXT CHECK (property_type IN ('平层', '小商品', '别墅', '办公室', '商业空间')),
  designer_in_charge TEXT,
  responsible_person TEXT,
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建材料表
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2),
  current_stock DECIMAL(10,2) DEFAULT 0,
  min_stock_alert DECIMAL(10,2) DEFAULT 0,
  supplier_name TEXT,
  supplier_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建材料出入库记录表
CREATE TABLE public.material_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('入库', '出库', '退货')),
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(12,2),
  supplier_name TEXT,
  delivered_by TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建工人表
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  worker_type TEXT NOT NULL,
  phone TEXT,
  skill_rating INT DEFAULT 0 CHECK (skill_rating >= 0 AND skill_rating <= 5),
  hourly_rate DECIMAL(8,2),
  daily_rate DECIMAL(8,2),
  status TEXT NOT NULL DEFAULT '空闲' CHECK (status IN ('空闲', '工作中', '休假', '离职')),
  specialties TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建工人工作记录表
CREATE TABLE public.worker_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  estimated_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  remaining_amount DECIMAL(10,2) DEFAULT 0,
  work_description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT '计划中' CHECK (status IN ('计划中', '进行中', '已完成', '暂停')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建施工队表
CREATE TABLE public.construction_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  team_leader TEXT NOT NULL,
  team_leader_phone TEXT,
  team_size INT DEFAULT 0,
  specialties TEXT[],
  efficiency_rating INT DEFAULT 0 CHECK (efficiency_rating >= 0 AND efficiency_rating <= 5),
  pricing_model TEXT CHECK (pricing_model IN ('包工', '包料', '包工包料')),
  status TEXT NOT NULL DEFAULT '空闲' CHECK (status IN ('空闲', '工作中', '休假')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建施工队项目分配表
CREATE TABLE public.team_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.construction_teams(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  contract_amount DECIMAL(12,2),
  paid_amount DECIMAL(12,2) DEFAULT 0,
  work_scope TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT '计划中' CHECK (status IN ('计划中', '进行中', '已完成', '暂停')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建人才库表
CREATE TABLE public.talents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT '潜在' CHECK (status IN ('在职', '离职', '潜在')),
  skill_rating INT DEFAULT 0 CHECK (skill_rating >= 0 AND skill_rating <= 5),
  experience_years INT DEFAULT 0,
  specialties TEXT[],
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建财务记录表
CREATE TABLE public.financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('收入', '支出')),
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 启用行级安全
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage payment nodes for their projects" ON public.payment_nodes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = payment_nodes.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can manage project phases for their projects" ON public.project_phases FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_phases.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view their own customers" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own customers" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own customers" ON public.customers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own materials" ON public.materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own materials" ON public.materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own materials" ON public.materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own materials" ON public.materials FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage material transactions for their materials" ON public.material_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.materials WHERE materials.id = material_transactions.material_id AND materials.user_id = auth.uid())
);

CREATE POLICY "Users can view their own workers" ON public.workers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workers" ON public.workers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workers" ON public.workers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workers" ON public.workers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage worker assignments for their workers and projects" ON public.worker_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workers WHERE workers.id = worker_assignments.worker_id AND workers.user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = worker_assignments.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view their own teams" ON public.construction_teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own teams" ON public.construction_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own teams" ON public.construction_teams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own teams" ON public.construction_teams FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage team assignments for their teams and projects" ON public.team_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.construction_teams WHERE construction_teams.id = team_assignments.team_id AND construction_teams.user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = team_assignments.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view their own talents" ON public.talents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own talents" ON public.talents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own talents" ON public.talents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own talents" ON public.talents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own financial records" ON public.financial_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own financial records" ON public.financial_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial records" ON public.financial_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financial records" ON public.financial_records FOR DELETE USING (auth.uid() = user_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 为需要的表创建更新时间触发器
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON public.project_phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_worker_assignments_updated_at BEFORE UPDATE ON public.worker_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_construction_teams_updated_at BEFORE UPDATE ON public.construction_teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_assignments_updated_at BEFORE UPDATE ON public.team_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON public.talents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();