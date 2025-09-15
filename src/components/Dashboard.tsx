import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  User,
  Zap,
  Package,
  CheckCircle,
  Calendar,
  BarChart3,
  FolderOpen,
  Calculator,
  ArrowRight
} from "lucide-react";
import StatCard from "./StatCard";
import { NewsTickerBanner } from "./NewsTickerBanner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useDashboardStats, type TimeFilter } from "@/hooks/useDashboardStats";


// 图表颜色配置
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

const chartConfig = {
  income: {
    label: "收入",
    color: "hsl(var(--stat-green))",
  },
  expense: {
    label: "支出", 
    color: "hsl(var(--stat-red))",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  
  // 使用真实数据
  const { stats, loading, error } = useDashboardStats(timeFilter);

  // 加载中状态
  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载统计数据...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载统计数据失败: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 没有数据时的默认状态
  if (!stats) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">暂无统计数据</p>
      </div>
    );
  }

  // 构建主要统计数据
  const mainStats = [
    {
      title: "项目完成率",
      value: `${stats.mainStats.projectCompletionRate.toFixed(1)}%`,
      subtitle: "项目完成情况",
      icon: TrendingUp,
      color: "blue" as const,
      trend: { value: `${stats.mainStats.projectCompletionRate.toFixed(1)}%`, isPositive: stats.mainStats.projectCompletionRate > 50 }
    },
    {
      title: "营业收入",
      value: `￥${(stats.mainStats.monthlyRevenue / 10000).toFixed(1)}万`,
      subtitle: "当期收入统计",
      icon: DollarSign,
      color: "green" as const,
      trend: { value: "实时数据", isPositive: true }
    },
    {
      title: "活跃客户",
      value: stats.mainStats.activeCustomers.toString(),
      subtitle: "当前活跃客户数",
      icon: Users,
      color: "purple" as const,
      trend: { value: `${stats.mainStats.activeCustomers}位`, isPositive: true }
    },
    {
      title: "工人数量",
      value: stats.mainStats.workerCount.toString(),
      subtitle: "在职工人统计",
      icon: User,
      color: "orange" as const,
      trend: { value: `${stats.mainStats.workerCount}人`, isPositive: true }
    }
  ];

  // 为二级统计数据添加图标
  const secondaryStatsWithIcons = stats.secondaryStats.map((stat, index) => {
    const icons = [Zap, CheckCircle, Calendar, Users];
    return {
      ...stat,
      icon: icons[index] || Package
    };
  });
  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">数据统计</h1>
            <p className="text-muted-foreground">实时查看装修项目数据概览</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">当前主题</p>
              <p className="text-xs text-muted-foreground">支持明暗切换</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Dynamic News Banner */}
        <NewsTickerBanner />
        
        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <div 
              key={index} 
              onClick={() => {
                if (stat.title === "完成项目") navigate('/projects');
                else if (stat.title === "活跃客户") navigate('/customers');
                else if (stat.title === "工人数量") navigate('/workers');
                else if (stat.title === "本月收入") navigate('/finance');
              }}
              className="cursor-pointer"
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Secondary Statistics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">项目状态分析</h2>
            <div className="flex items-center space-x-2">
              <select 
                className="text-sm border border-border rounded-lg px-3 py-1 bg-card text-foreground"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              >
                <option value="month">本月</option>
                <option value="quarter">本季度</option>
                <option value="year">本年</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryStatsWithIcons.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">项目进度分布</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.projectDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {stats.projectDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}个 ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">财务概览</h3>
            <ChartContainer config={chartConfig} className="h-64 md:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.financeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `¥${(value/10000).toFixed(0)}万`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [
                      `¥${(value/10000).toFixed(1)}万`,
                      name === 'income' ? '收入' : '支出'
                    ]}
                  />
                  <Bar dataKey="income" fill="hsl(var(--stat-green))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--stat-red))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-stat-green" />
                <span className="text-sm text-foreground">收入</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-stat-red" />
                <span className="text-sm text-foreground">支出</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}