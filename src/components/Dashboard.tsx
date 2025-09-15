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

// 保留颜色常量，主统计数据在函数体内基于实时数据构建


export default function Dashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  const { stats, loading, error } = useDashboardStats(timeFilter);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    );
  }

  // 如果出错，显示错误信息
  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">数据加载失败</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // 如果没有数据，返回空状态
  if (!stats) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">暂无数据</p>
        </div>
      </div>
    );
  }

  // 构建主要统计数据数组
  const mainStats = [
    {
      title: "完成项目",
      value: `${stats.mainStats.projectCompletionRate.toFixed(1)}%`,
      subtitle: "项目完成率",
      icon: CheckCircle,
      color: "green" as const
    },
    {
      title: "本月收入",
      value: `¥${(stats.mainStats.monthlyRevenue / 10000).toFixed(1)}万`,
      subtitle: "总收入",
      icon: DollarSign,
      color: "green" as const
    },
    {
      title: "活跃客户",
      value: stats.mainStats.activeClients.toString(),
      subtitle: "正在服务中",
      icon: Users,
      color: "blue" as const
    },
    {
      title: "工人数量",
      value: stats.mainStats.workerCount.toString(),
      subtitle: "活跃工人",
      icon: User,
      color: "yellow" as const
    }
  ];
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
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Dynamic News Banner */}
        <NewsTickerBanner />

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.secondaryStats.map((stat, index) => {
              const icons = [Zap, CheckCircle, Calendar, Users];
              return <StatCard key={index} {...stat} icon={icons[index] || Package} />;
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">项目进度分布</h3>
            <ChartContainer config={chartConfig} className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.projectDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.projectDistribution.map((_, index) => (
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

          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">财务概览</h3>
            <ChartContainer config={chartConfig} className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.financeData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
                  barCategoryGap="20%"
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    interval={0}
                    tickMargin={15}
                    tickSize={0}
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
                  <Bar dataKey="income" fill="hsl(var(--stat-green))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="expense" fill="hsl(var(--stat-red))" radius={[4, 4, 0, 0]} maxBarSize={60} />
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