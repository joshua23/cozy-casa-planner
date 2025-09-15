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
    activeClients: number;
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

      // 获取项目数据及其阶段信息
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_phases (
            phase_name,
            status,
            completion_percentage
          )
        `)
        .eq('user_id', user.id);

      if (projectsError) {
        console.error('获取项目数据失败:', projectsError);
        throw projectsError;
      }

      console.log('获取到的项目数据（含阶段）:', projects);

      // 计算项目完成率
      const totalProjects = projects?.length || 0;

      // 智能分析项目实际状态（基于项目阶段进度）
      const projectsWithRealStatus = projects?.map(project => {
        let realStatus = project.status || '未设置';
        
        // 如果有项目阶段数据，根据阶段进度分析实际状态
        if (project.project_phases && project.project_phases.length > 0) {
          const phases = project.project_phases;
          
          // 检查是否有进行中的阶段
          const activePhase = phases.find(phase => phase.status === '进行中');
          if (activePhase) {
            // 根据具体阶段名称确定更精确的状态
            switch (activePhase.phase_name) {
              case '拆除阶段':
                realStatus = '拆除中';
                break;
              case '水电阶段':
                realStatus = '水电改造中';
                break;
              case '泥工阶段':
                realStatus = '泥瓦施工中';
                break;
              case '木工阶段':
                realStatus = '木工施工中';
                break;
              case '油漆阶段':
                realStatus = '油漆施工中';
                break;
              default:
                realStatus = '施工中';
            }
          } else {
            // 检查最高进度的阶段
            const maxProgressPhase = phases.reduce((max, phase) => 
              phase.completion_percentage > max.completion_percentage ? phase : max
            );
            
            if (maxProgressPhase.completion_percentage > 0) {
              realStatus = maxProgressPhase.phase_name;
            }
          }
        }
        
        return { ...project, realStatus };
      }) || [];

      console.log('项目实际状态分析:', projectsWithRealStatus.map(p => ({
        name: p.name,
        originalStatus: p.status,
        realStatus: p.realStatus,
        phases: p.project_phases
      })));

      // 获取项目状态分布（基于实际状态）
      const statusCounts = projectsWithRealStatus.reduce((acc, project) => {
        const status = project.realStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectDistribution = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
        percentage: totalProjects > 0 ? Math.round((value / totalProjects) * 100) : 0
      }));

      // 定义项目状态映射（基于实际状态）
      const statusMapping = {
        completed: ['已完成', '完成', '竣工', '验收完成'],
        inProgress: [
          '进行中', '施工中', '装修中', '在建',
          '拆除中', '拆除阶段', 
          '水电改造中', '水电阶段',
          '泥瓦施工中', '泥工阶段',
          '木工施工中', '木工阶段', 
          '油漆施工中', '油漆阶段'
        ],
        pending: ['待开始', '未开始', '待施工', '设计中', '设计阶段', '等待开工'],
        paused: ['暂停', '停工', '延期']
      };

      const completedProjectsCount = projectsWithRealStatus.filter(p => 
        statusMapping.completed.includes(p.realStatus)
      ).length;

      const inProgressProjectsCount = projectsWithRealStatus.filter(p => 
        statusMapping.inProgress.includes(p.realStatus)
      ).length;

      const pendingProjectsCount = projectsWithRealStatus.filter(p => 
        statusMapping.pending.includes(p.realStatus)
      ).length;

      const completionRate = totalProjects > 0 ? (completedProjectsCount / totalProjects) * 100 : 0;

      console.log('项目状态分析:', {
        总项目数: totalProjects,
        已完成: completedProjectsCount,
        进行中: inProgressProjectsCount,
        待开始: pendingProjectsCount,
        项目详情: projectsWithRealStatus.map(p => ({ 
          name: p.name, 
          originalStatus: p.status,
          realStatus: p.realStatus 
        }))
      });

      return {
        completionRate,
        projectDistribution,
        totalProjects,
        completedProjects: completedProjectsCount,
        inProgressProjects: inProgressProjectsCount,
        pendingProjects: pendingProjectsCount
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
      // 首先尝试通过user_id获取，如果为空则获取所有记录（处理历史数据）
      let { data: records, error } = await supabase
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

      // 如果通过user_id查询为空，尝试获取所有财务记录并过滤
      if (!records || records.length === 0) {
        console.log('通过user_id查询财务记录为空，尝试获取所有记录...');
        const { data: allRecords, error: allError } = await supabase
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
          .order('transaction_date', { ascending: true });
        
        if (allError) {
          error = allError;
        } else {
          // 过滤属于当前用户的记录（通过项目关联或无user_id的历史记录）
          records = allRecords?.filter(record => {
            return !record.user_id || record.user_id === user.id || 
                   (record.projects && record.projects.user_id === user.id);
          }) || [];
        }
      }

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
            { month: 'W1', income: 0, expense: 0 },
            { month: 'W2', income: 0, expense: 0 },
            { month: 'W3', income: 0, expense: 0 },
            { month: 'W4', income: 0, expense: 0 }
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
        const weeks = ['W1', 'W2', 'W3', 'W4'];
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

  // 获取客户统计数据（基于projects表的client信息）
  const getClientStats = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('用户未登录，返回默认客户统计');
        return {
          activeClients: 0,
          totalClients: 0,
          potentialCustomers: 0
        };
      }

      // 获取正式客户（来自projects表）
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('client_name, client_phone, client_email, status')
        .eq('user_id', user.id)
        .not('client_name', 'is', null);

      if (projectsError) {
        console.error('获取项目客户失败:', projectsError);
      }

      // 获取潜在客户（来自customers表，未转化的）
      const { data: potentialCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);

      if (customersError) {
        console.error('获取潜在客户失败:', customersError);
      }

      console.log('获取到的项目客户数据:', projects);
      console.log('获取到的潜在客户数据:', potentialCustomers);

      // 统计唯一客户（基于姓名和电话去重）
      const uniqueClients = new Map();
      projects?.forEach(project => {
        const key = `${project.client_name}-${project.client_phone || 'no-phone'}`;
        if (!uniqueClients.has(key)) {
          uniqueClients.set(key, {
            name: project.client_name,
            phone: project.client_phone,
            email: project.client_email,
            status: '已签约', // 项目表中的客户都是已签约客户
            hasActiveProject: project.status === '设计中' || project.status === '进行中'
          });
        } else {
          // 更新活跃状态
          const existing = uniqueClients.get(key);
          if (project.status === '设计中' || project.status === '进行中') {
            existing.hasActiveProject = true;
          }
        }
      });

      const totalClients = uniqueClients.size;
      const activeClients = Array.from(uniqueClients.values()).filter(client => 
        client.hasActiveProject
      ).length;
      const potentialCount = potentialCustomers?.length || 0;

      console.log('客户统计结果:', {
        totalClients,
        activeClients,
        potentialCount,
        uniqueClients: Array.from(uniqueClients.values())
      });

      return {
        activeClients,
        totalClients,
        potentialCustomers: potentialCount
      };
    } catch (error) {
      console.error('获取客户统计失败:', error);
      return {
        activeClients: 0,
        totalClients: 0,
        potentialCustomers: 0
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

      // 尝试获取工人数据，处理user_id为null的情况
      let { data: workers, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id);

      // 如果为空，尝试获取所有工人数据（处理历史数据）
      if (!workers || workers.length === 0) {
        console.log('通过user_id查询工人为空，尝试获取所有工人...');
        const { data: allWorkers, error: allError } = await supabase
          .from('workers')
          .select('*');
        
        if (allError) {
          error = allError;
        } else {
          // 过滤属于当前用户的工人或无user_id的历史记录
          workers = allWorkers?.filter(worker => {
            return !worker.user_id || worker.user_id === user.id;
          }) || [];
        }
      }

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

      console.log('开始获取Dashboard统计数据...');
      console.log('当前时间过滤器:', timeFilter);

      const [
        projectStats,
        financeStats,
        clientStats,
        workerStats
      ] = await Promise.all([
        getProjectStats(),
        getFinanceStats(timeFilter),
        getClientStats(),
        getWorkerStats()
      ]);

      console.log('获取的统计数据:');
      console.log('- 项目统计:', projectStats);
      console.log('- 财务统计:', financeStats);
      console.log('- 客户统计:', clientStats);
      console.log('- 工人统计:', workerStats);

      // 组装主要统计数据
      const mainStats = {
        projectCompletionRate: projectStats.completionRate,
        monthlyRevenue: financeStats.totalIncome,
        activeClients: clientStats.activeClients,
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
          title: "正式客户",
          value: clientStats.totalClients.toString(),
          subtitle: "已签约客户",
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
