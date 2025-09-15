import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { secureQuery, secureJoinQuery } from '@/utils/secureDataFetch';

// 定义时间过滤类型
export type TimeFilter = 'month' | 'quarter' | 'year';

// 定义统计数据类型
export interface DashboardStats {
  mainStats: {
    projectCompletionRate: number;
    monthlyRevenue: number;
    activeClients: number;
    workerCount: number;
  };
  projectDistribution: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  financeData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  secondaryStats: Array<{
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    color: 'yellow' | 'green' | 'red' | 'blue';
  }>;
}

// 获取时间范围
const getTimeRange = (filter: TimeFilter) => {
  const now = new Date();
  switch (filter) {
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'quarter':
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
};

// 获取项目统计数据
const fetchProjectStats = async (): Promise<any> => {
  const projects = await secureJoinQuery(
    'projects',
    `
      *,
      project_phases (
        phase_name,
        status,
        completion_percentage
      )
    `,
    {},
    { orderBy: { column: 'created_at', ascending: false } }
  );

  console.log('获取到的项目数据（含阶段）:', projects);

  const totalProjects = projects.length;

  // 智能分析项目实际状态
  const projectsWithRealStatus = projects.map((project: any) => {
    let realStatus = project.status || '未设置';

    if (project.project_phases && project.project_phases.length > 0) {
      const phases = project.project_phases;
      const activePhase = phases.find((phase: any) => phase.status === '进行中');

      if (activePhase) {
        switch (activePhase.phase_name) {
          case '拆除阶段': realStatus = '拆除中'; break;
          case '水电阶段': realStatus = '水电改造中'; break;
          case '泥工阶段': realStatus = '泥瓦施工中'; break;
          case '木工阶段': realStatus = '木工施工中'; break;
          case '油漆阶段': realStatus = '油漆施工中'; break;
          default: realStatus = '施工中';
        }
      } else {
        const maxProgressPhase = phases.reduce((max: any, phase: any) =>
          phase.completion_percentage > max.completion_percentage ? phase : max
        );
        if (maxProgressPhase.completion_percentage > 0) {
          realStatus = maxProgressPhase.phase_name;
        }
      }
    }

    return { ...project, realStatus };
  });

  // 获取项目状态分布
  const statusCounts = projectsWithRealStatus.reduce((acc: any, project: any) => {
    const status = project.realStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const projectDistribution = Object.entries(statusCounts).map(([name, value]: [string, any]) => ({
    name,
    value,
    percentage: totalProjects > 0 ? Math.round((value / totalProjects) * 100) : 0
  }));

  // 状态映射
  const statusMapping = {
    completed: ['已完成', '完成', '竣工', '验收完成'],
    inProgress: ['进行中', '施工中', '装修中', '在建', '拆除中', '拆除阶段', '水电改造中', '水电阶段', '泥瓦施工中', '泥工阶段', '木工施工中', '木工阶段', '油漆施工中', '油漆阶段'],
    pending: ['待开始', '未开始', '待施工', '设计中', '设计阶段', '等待开工'],
    paused: ['暂停', '停工', '延期']
  };

  const completedProjectsCount = projectsWithRealStatus.filter((p: any) =>
    statusMapping.completed.includes(p.realStatus)
  ).length;

  const inProgressProjectsCount = projectsWithRealStatus.filter((p: any) =>
    statusMapping.inProgress.includes(p.realStatus)
  ).length;

  const pendingProjectsCount = projectsWithRealStatus.filter((p: any) =>
    statusMapping.pending.includes(p.realStatus)
  ).length;

  const completionRate = totalProjects > 0 ? (completedProjectsCount / totalProjects) * 100 : 0;

  return {
    completionRate,
    projectDistribution,
    totalProjects,
    completedProjects: completedProjectsCount,
    inProgressProjects: inProgressProjectsCount,
    pendingProjects: pendingProjectsCount
  };
};

// 获取财务统计数据
const fetchFinanceStats = async (filter: TimeFilter): Promise<any> => {
  const records = await secureQuery('financial_records', {
    select: 'transaction_date, transaction_type, amount',
    orderBy: { column: 'transaction_date', ascending: true }
  });

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
    return { financeData: emptyData, totalIncome: 0, totalExpense: 0 };
  }

  // 计算总收入和总支出
  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach((record: any) => {
    if (record.transaction_type === '收入' || record.transaction_type === 'income') {
      totalIncome += record.amount;
    } else if (record.transaction_type === '支出' || record.transaction_type === 'expense') {
      totalExpense += record.amount;
    }
  });

  // 按时间过滤和分组财务数据
  const timeRange = getTimeRange(filter);
  const filteredRecords = records.filter((r: any) => {
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

      const weekRecords = filteredRecords.filter((r: any) => {
        const date = new Date(r.transaction_date);
        return date >= weekStart && date <= weekEnd;
      });

      const income = weekRecords
        .filter((r: any) => r.transaction_type === '收入' || r.transaction_type === 'income')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      const expense = weekRecords
        .filter((r: any) => r.transaction_type === '支出' || r.transaction_type === 'expense')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      financeData.push({ month: week, income, expense });
    });
  } else if (filter === 'quarter') {
    // 按月分组
    for (let i = 0; i < 3; i++) {
      const monthStart = new Date(timeRange.start);
      monthStart.setMonth(monthStart.getMonth() + i);
      const monthEnd = endOfMonth(monthStart);

      const monthRecords = filteredRecords.filter((r: any) => {
        const date = new Date(r.transaction_date);
        return date >= monthStart && date <= monthEnd;
      });

      const income = monthRecords
        .filter((r: any) => r.transaction_type === '收入' || r.transaction_type === 'income')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      const expense = monthRecords
        .filter((r: any) => r.transaction_type === '支出' || r.transaction_type === 'expense')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      financeData.push({ month: format(monthStart, 'MM月'), income, expense });
    }
  } else {
    // 按季度分组
    for (let i = 0; i < 4; i++) {
      const quarterStart = new Date(timeRange.start);
      quarterStart.setMonth(i * 3);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterStart.getMonth() + 2);
      quarterEnd.setDate(31);

      const quarterRecords = filteredRecords.filter((r: any) => {
        const date = new Date(r.transaction_date);
        return date >= quarterStart && date <= quarterEnd;
      });

      const income = quarterRecords
        .filter((r: any) => r.transaction_type === '收入' || r.transaction_type === 'income')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      const expense = quarterRecords
        .filter((r: any) => r.transaction_type === '支出' || r.transaction_type === 'expense')
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      financeData.push({ month: `Q${i + 1}`, income, expense });
    }
  }

  return { financeData, totalIncome, totalExpense };
};

// 获取客户统计数据
const fetchClientStats = async (): Promise<any> => {
  const [projects, potentialCustomers] = await Promise.all([
    secureQuery('projects', {
      select: 'client_name, client_phone, client_email, status'
    }),
    secureQuery('customers', { select: '*' })
  ]);

  // 统计唯一客户
  const uniqueClients = new Map();
  projects.forEach((project: any) => {
    if (!project.client_name) return;
    const key = `${project.client_name}-${project.client_phone || 'no-phone'}`;
    if (!uniqueClients.has(key)) {
      uniqueClients.set(key, {
        name: project.client_name,
        phone: project.client_phone,
        email: project.client_email,
        status: '已签约',
        hasActiveProject: project.status === '设计中' || project.status === '进行中'
      });
    } else {
      const existing = uniqueClients.get(key);
      if (project.status === '设计中' || project.status === '进行中') {
        existing.hasActiveProject = true;
      }
    }
  });

  const totalClients = uniqueClients.size;
  const activeClients = Array.from(uniqueClients.values()).filter((client: any) =>
    client.hasActiveProject
  ).length;
  const potentialCount = potentialCustomers.length;

  return {
    activeClients,
    totalClients,
    potentialCustomers: potentialCount
  };
};

// 获取工人统计数据
const fetchWorkerStats = async (): Promise<any> => {
  const workers = await secureQuery('workers', { select: 'status' });
  const activeWorkers = workers.filter((w: any) => w.status === 'active' || w.status === '活跃').length;

  return {
    workerCount: activeWorkers,
    totalWorkers: workers.length
  };
};

/**
 * 使用React Query的Dashboard统计数据Hook
 * 提供数据缓存、自动重新获取和优化的加载状态
 */
export function useDashboardStatsQuery(timeFilter: TimeFilter = 'month') {
  // 获取所有统计数据
  const fetchAllStats = async (): Promise<DashboardStats> => {
    console.log('开始获取Dashboard统计数据...', timeFilter);

    const [projectStats, financeStats, clientStats, workerStats] = await Promise.all([
      fetchProjectStats(),
      fetchFinanceStats(timeFilter),
      fetchClientStats(),
      fetchWorkerStats()
    ]);

    console.log('获取的统计数据:', { projectStats, financeStats, clientStats, workerStats });

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
        icon: null,
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

    return {
      mainStats,
      projectDistribution: projectStats.projectDistribution,
      financeData: financeStats.financeData,
      secondaryStats
    };
  };

  return useQuery({
    queryKey: ['dashboard-stats', timeFilter],
    queryFn: fetchAllStats,
    staleTime: 3 * 60 * 1000, // 3分钟缓存（Dashboard数据变化较快）
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // Dashboard回到焦点时刷新
    retry: (failureCount, error) => {
      if (error?.message?.includes('未登录')) return false;
      return failureCount < 2;
    }
  });
}