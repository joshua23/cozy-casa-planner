import { supabase } from '@/integrations/supabase/client';

/**
 * 安全的用户数据获取工具
 * 确保所有数据查询都经过用户身份验证和权限检查
 */

interface SecureQueryOptions {
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  filters?: Record<string, any>;
}

/**
 * 获取当前认证用户
 * @returns 当前用户对象或null
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('获取用户信息失败:', error);
    throw new Error('用户身份验证失败');
  }
  if (!user) {
    throw new Error('用户未登录');
  }
  return user;
}

/**
 * 安全的数据查询函数
 * 自动添加user_id过滤，确保数据安全隔离
 */
export async function secureQuery(
  tableName: string,
  options: SecureQueryOptions = {}
) {
  const user = await getCurrentUser();

  let query = supabase
    .from(tableName)
    .select(options.select || '*')
    .eq('user_id', user.id);

  // 添加额外过滤条件
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // 添加排序
  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true
    });
  }

  // 添加限制
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`查询${tableName}失败:`, error);
    throw error;
  }

  return data || [];
}

/**
 * 安全的关联查询函数
 * 用于查询包含关联表数据的复杂查询
 */
export async function secureJoinQuery(
  tableName: string,
  selectClause: string,
  joinConditions: Record<string, any> = {},
  options: Omit<SecureQueryOptions, 'select'> = {}
) {
  const user = await getCurrentUser();

  let query = supabase
    .from(tableName)
    .select(selectClause)
    .eq('user_id', user.id);

  // 添加关联表的过滤条件
  Object.entries(joinConditions).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  // 添加额外过滤条件
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // 添加排序
  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true
    });
  }

  // 添加限制
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`关联查询${tableName}失败:`, error);
    throw error;
  }

  return data || [];
}

/**
 * 安全的统计查询函数
 * 用于聚合统计类查询
 */
export async function secureStatsQuery(
  tableName: string,
  selectClause: string,
  filters: Record<string, any> = {}
) {
  const user = await getCurrentUser();

  let query = supabase
    .from(tableName)
    .select(selectClause)
    .eq('user_id', user.id);

  // 添加过滤条件
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  if (error) {
    console.error(`统计查询${tableName}失败:`, error);
    throw error;
  }

  return data || [];
}

/**
 * 安全的数据插入函数
 * 自动添加user_id和时间戳
 */
export async function secureInsert(
  tableName: string,
  data: Record<string, any>
) {
  const user = await getCurrentUser();

  const insertData = {
    ...data,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: result, error } = await supabase
    .from(tableName)
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error(`插入${tableName}失败:`, error);
    throw error;
  }

  return result;
}

/**
 * 安全的数据更新函数
 * 确保只能更新自己的数据
 */
export async function secureUpdate(
  tableName: string,
  id: string,
  updates: Record<string, any>
) {
  const user = await getCurrentUser();

  const updateData = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error(`更新${tableName}失败:`, error);
    throw error;
  }

  return data;
}

/**
 * 安全的数据删除函数
 * 确保只能删除自己的数据
 */
export async function secureDelete(
  tableName: string,
  id: string
) {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error(`删除${tableName}失败:`, error);
    throw error;
  }

  return true;
}