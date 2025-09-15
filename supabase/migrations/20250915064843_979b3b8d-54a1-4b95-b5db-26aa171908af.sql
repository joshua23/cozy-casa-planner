-- 为 joshzhang34@gmail.com 分配管理员角色
DO $$
DECLARE
  _user_id UUID;
BEGIN
  -- 查找用户ID (通过 auth.users 表的 email)
  SELECT id INTO _user_id 
  FROM auth.users 
  WHERE email = 'joshzhang34@gmail.com';
  
  IF _user_id IS NOT NULL THEN
    -- 删除现有的用户角色
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- 添加管理员角色
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin');
    
    RAISE NOTICE '已为用户 % 分配管理员角色', 'joshzhang34@gmail.com';
  ELSE
    RAISE NOTICE '未找到邮箱为 % 的用户', 'joshzhang34@gmail.com';
  END IF;
END;
$$;