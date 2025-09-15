-- 创建测试管理员用户（需要在认证后手动分配角色）
-- 首先我们创建一个函数来分配管理员角色
CREATE OR REPLACE FUNCTION public.assign_admin_role(_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- 获取用户ID
  SELECT id INTO _user_id 
  FROM auth.users 
  WHERE email = _email;
  
  IF _user_id IS NOT NULL THEN
    -- 删除现有的用户角色（如果有）
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'user';
    
    -- 添加管理员角色
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;