import { supabase } from '@/integrations/supabase/client';

/**
 * 测试Supabase连接和数据查询
 */
export async function testSupabaseConnection() {
  try {
    console.log('=== 开始测试Supabase连接 ===');
    
    // 1. 测试用户认证状态
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('用户认证状态:');
    console.log('- 用户:', user);
    console.log('- 错误:', userError);
    
    if (!user) {
      console.log('❌ 用户未登录，无法获取数据');
      return false;
    }
    
    // 2. 测试项目数据查询
    console.log('\n测试项目数据查询...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('项目查询结果:');
    console.log('- 数据:', projects);
    console.log('- 错误:', projectsError);
    console.log('- 项目数量:', projects?.length || 0);
    
    // 3. 测试财务记录查询
    console.log('\n测试财务记录查询...');
    const { data: finances, error: financeError } = await supabase
      .from('financial_records')
      .select(`
        *,
        projects (
          id,
          name,
          client_name
        )
      `)
      .eq('user_id', user.id);
    
    console.log('财务记录查询结果:');
    console.log('- 数据:', finances);
    console.log('- 错误:', financeError);
    console.log('- 记录数量:', finances?.length || 0);
    
    // 4. 测试客户数据查询
    console.log('\n测试客户数据查询...');
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('客户查询结果:');
    console.log('- 数据:', customers);
    console.log('- 错误:', customerError);
    console.log('- 客户数量:', customers?.length || 0);
    
    // 5. 测试工人数据查询
    console.log('\n测试工人数据查询...');
    const { data: workers, error: workerError } = await supabase
      .from('workers')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('工人查询结果:');
    console.log('- 数据:', workers);
    console.log('- 错误:', workerError);
    console.log('- 工人数量:', workers?.length || 0);
    
    console.log('\n=== Supabase连接测试完成 ===');
    
    return {
      user,
      projects: projects || [],
      finances: finances || [],
      customers: customers || [],
      workers: workers || [],
      hasData: (projects?.length || 0) > 0 || (finances?.length || 0) > 0
    };
    
  } catch (error) {
    console.error('❌ Supabase连接测试失败:', error);
    return false;
  }
}

/**
 * 在浏览器控制台中运行测试
 */
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;
  console.log('💡 可以在控制台运行 testSupabase() 来测试数据库连接');
}
