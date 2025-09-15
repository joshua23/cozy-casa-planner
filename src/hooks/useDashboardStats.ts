import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

// 定义时间过滤类型
export type TimeFilter = 'month' | 'quarter' | 'year';

// 定义统计数据类型
export interface DashboardStats {
  // 主要统计数据
  mainStats: {
    projectCompletionRate: number;
    monthlyRevenue: number;
    activeCustomers: number;
    workerCount: number;
  };
  
  // 项目状态分布数据
  projectDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  
  // 财务数据（按时间过滤）
  financeData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  
  // 二级统计数据
  secondaryStats: Array<{
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    color: 'yellow' | 'green' | 'red' | 'blue';
  }>;
}

/**
 * Dashboard统计数据Hook
 * 从Supabase获取真实数据并计算统计信息
 */
export function useDashboardStats(timeFilter: TimeFilter = 'month') {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取时间范围
  const getTimeRange = (filter: TimeFilter) => {
    const now = new Date();
    switch (filter) {
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case 'quarter':
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now)
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  // 获取项目统计数据
  const getProjectStats = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用户未登录，返回默认项目统计');
        return {
          completionRate: 0,
          projectDistribution: [],
          totalProjects: 0,
          completedProjects: 0,
          inProgressProjects: 0,
          pendingProjects: 0
        };
      }

      // 获取当前用户的所有项目
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      if (projectsError) {
        console.error('获取项目数据失败:', projectsError);
        throw projectsError;
      }

      console.log('获取到的项目数据:', projects);

      // 计算项目完成率
      const totalProjects = projects?.length || 0;
      const completedProjects = projects?.filter(p => p.status === '已完成').length || 0;
      const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

      // 获取项目状态分布
      const statusCounts = projects?.reduce((acc, project) => {
        const status = project.status || '未设置';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const projectDistribution = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
        percentage: totalProjects > 0 ? Math.round((value / totalProjects) * 100) : 0
      }));

      return {
        completionRate,
        projectDistribution,
        totalProjects,
        completedProjects,
        inProgressProjects: projects?.filter(p => p.status === '进行中').length || 0,
        pendingProjects: projects?.filter(p => p.status === '待开始' || p.status === '未开始').length || 0
      };
    } catch (error) {
      console.error('获取项目统计失败:', error);
      return {
        completionRate: 0,
        projectDistribution: [],
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        pendingProjects: 0
      };
    }
  };

  // 获取财务统计数据
  const getFinanceStats = async (filter: TimeFilter) => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用户未登录，返回默认财务统计');
        return {
          financeData: [],
          totalIncome: 0,
          totalExpense: 0
        };
      }

      // 获取财务记录（包含关联的项目信息）
      const { data: records, error } = await supabase
        .from('financial_records')
        .select(`
          *,
          projects (
            id,
            name,
            client_name,
            user_id
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: true });

      if (error) {
        console.error('获取财务记录失败:', error);
        throw error;
      }

      console.log('获取到的财务记录:', records);

      // 如果没有数据，返回空的默认结构
      if (!records || records.length === 0) {
        const emptyData = [];
        if (filter === 'month') {
          emptyData.push(
            { month: '第1周', income: 0, expense: 0 },
            { month: '第2周', income: 0, expense: 0 },
            { month: '第3周', income: 0, expense: 0 },
            { month: '第4周', income: 0, expense: 0 }
          );
        } else if (filter === 'quarter') {
          emptyData.push(
            { month: '01月', income: 0, expense: 0 },
            { month: '02月', income: 0, expense: 0 },
            { month: '03月', income: 0, expense: 0 }
          );
        } else {
          emptyData.push(
            { month: 'Q1', income: 0, expense: 0 },
            { month: 'Q2', income: 0, expense: 0 },
            { month: 'Q3', income: 0, expense: 0 },
            { month: 'Q4', income: 0, expense: 0 }
          );
        }
        return {
          financeData: emptyData,
          totalIncome: 0,
          totalExpense: 0
        };
      }

      // 计算总收入和总支出（不受时间过滤影响，显示全部）
      let totalIncome = 0;
      let totalExpense = 0;

      records.forEach(record => {
        if (record.transaction_type === '收入' || record.transaction_type === 'income') {
          totalIncome += record.amount;
        } else if (record.transaction_type === '支出' || record.transaction_type === 'expense') {
          totalExpense += record.amount;
        }
      });

      // 按时间过滤和分组财务数据（用于图表显示）
      const timeRange = getTimeRange(filter);
      const filteredRecords = records.filter(r => {
        const date = new Date(r.transaction_date);
        return date >= timeRange.start && date <= timeRange.end;
      });

      const financeData = [];

      if (filter === 'month') {
        // 按周分组
        const weeks = ['第1周', '第2周', '第3周', '第4周'];
        weeks.forEach((week, index) => {
          const weekStart = new Date(timeRange.start);
          weekStart.setDate(weekStart.getDate() + index * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          const weekRecords = filteredRecords.filter(r => {
            const date = new Date(r.transaction_date);
            return date >= weekStart && date <= weekEnd;
          });

          const income = weekRecords
            .filter(r => r.transaction_type === '收入' || r.transaction_type === 'income')
            .reduce((sum, r) => sum + r.amount, 0);
          
          const expense = weekRecords
            .filter(r => r.transaction_type === '支出' || r.transaction_type === 'expense')
            .reduce((sum, r) => sum + r.amount, 0);

          financeData.push({
            month: week,
            income,
            expense
          });
        });
      } else if (filter === 'quarter') {
        // 按月分组
        for (let i = 0; i < 3; i++) {
          const monthStart = new Date(timeRange.start);
          monthStart.setMonth(monthStart.getMonth() + i);
          const monthEnd = endOfMonth(monthStart);

          const monthRecords = filteredRecords.filter(r => {
            const date = new Date(r.transaction_date);
            return date >= monthStart && date <= monthEnd;
          });

          const income = monthRecords
            .filter(r => r.transaction_type === '收入' || r.transaction_type === 'income')
            .reduce((sum, r) => sum + r.amount, 0);
          
          const expense = monthRecords
            .filter(r => r.transaction_type === '支出' || r.transaction_type === 'expense')
            .reduce((sum, r) => sum + r.amount, 0);

          financeData.push({
            month: format(monthStart, 'MM月'),
            income,
            expense
          });
        }
      } else {
        // 按季度分组
        for (let i = 0; i < 4; i++) {
          const quarterStart = new Date(timeRange.start);
          quarterStart.setMonth(i * 3);
          const quarterEnd = new Date(quarterStart);
          quarterEnd.setMonth(quarterStart.getMonth() + 2);
          quarterEnd.setDate(31);

          const quarterRecords = filteredRecords.filter(r => {
            const date = new Date(r.transaction_date);
            return date >= quarterStart && date <= quarterEnd;
          });

          const income = quarterRecords
            .filter(r => r.transaction_type === '收入' || r.transaction_type === 'income')
            .reduce((sum, r) => sum + r.amount, 0);
          
          const expense = quarterRecords
            .filter(r => r.transaction_type === '支出' || r.transaction_type === 'expense')
            .reduce((sum, r) => sum + r.amount, 0);

          financeData.push({
            month: `Q${i + 1}`,
            income,
            expense
          });
        }
      }

      return {
        financeData,
        totalIncome,
        totalExpense
      };
    } catch (error) {
      console.error('获取财务统计失败:', error);
      return {
        financeData: [],
        totalIncome: 0,
        totalExpense: 0
      };
    }
  };

  // 获取客户统计数据
  const getCustomerStats = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用户未登录，返回默认客户统计');
        return {
          activeCustomers: 0,
          totalCustomers: 0
        };
      }

      const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('获取客户数据失败:', error);
        throw error;
      }

      console.log('获取到的客户数据:', customers);

      const activeCustomers = customers?.filter(c => c.status === 'active' || c.status === '活跃').length || 0;
      
      return {
        activeCustomers,
        totalCustomers: customers?.length || 0
      };
    } catch (error) {
      console.error('获取客户统计失败:', error);
      return {
        activeCustomers: 0,
        totalCustomers: 0
      };
    }
  };

  // 获取工人统计数据
  const getWorkerStats = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用户未登录，返回默认工人统计');
        return {
          workerCount: 0,
          totalWorkers: 0
        };
      }

      const { data: workers, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('获取工人数据失败:', error);
        throw error;
      }

      console.log('获取到的工人数据:', workers);

      const activeWorkers = workers?.filter(w => w.status === 'active' || w.status === '活跃').length || 0;
      
      return {
        workerCount: activeWorkers,
        totalWorkers: workers?.length || 0
      };
    } catch (error) {
      console.error('获取工人统计失败:', error);
      return {
        workerCount: 0,
        totalWorkers: 0
      };
    }
  };

  // 获取所有统计数据
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        projectStats,
        financeStats,
        customerStats,
        workerStats
      ] = await Promise.all([
        getProjectStats(),
        getFinanceStats(timeFilter),
        getCustomerStats(),
        getWorkerStats()
      ]);

      // 组装主要统计数据
      const mainStats = {
        projectCompletionRate: projectStats.completionRate,
        monthlyRevenue: financeStats.totalIncome,
        activeCustomers: customerStats.activeCustomers,
        workerCount: workerStats.workerCount
      };

      // 组装二级统计数据
      const secondaryStats = [
        {
          title: "在建项目",
          value: projectStats.inProgressProjects.toString(),
          subtitle: "进行中项目",
          icon: null, // 将在组件中设置
          color: "yellow" as const
        },
        {
          title: "已完项目",
          value: projectStats.completedProjects.toString(),
          subtitle: `本${timeFilter === 'month' ? '月' : timeFilter === 'quarter' ? '季' : '年'}完成`,
          icon: null,
          color: "green" as const
        },
        {
          title: "未开项目",
          value: projectStats.pendingProjects.toString(),
          subtitle: "待开工项目",
          icon: null,
          color: "red" as const
        },
        {
          title: "总客户数",
          value: customerStats.totalCustomers.toString(),
          subtitle: "客户总数",
          icon: null,
          color: "blue" as const
        }
      ];

      const dashboardStats: DashboardStats = {
        mainStats,
        projectDistribution: projectStats.projectDistribution,
        financeData: financeStats.financeData,
        secondaryStats
      };

      setStats(dashboardStats);
    } catch (err) {
      console.error('获取Dashboard统计数据失败:', err);
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeFilter]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
