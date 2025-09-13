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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";

// 项目进度数据
const projectProgressData = [
  { name: "设计阶段", value: 8, percentage: 32 },
  { name: "施工准备", value: 5, percentage: 20 },
  { name: "装修中", value: 7, percentage: 28 },
  { name: "验收", value: 3, percentage: 12 },
  { name: "完工", value: 2, percentage: 8 }
];

// 财务数据
const financeData = [
  { month: "1月", income: 85000, expense: 52000 },
  { month: "2月", income: 92000, expense: 58000 },
  { month: "3月", income: 78000, expense: 48000 },
  { month: "4月", income: 105000, expense: 65000 },
  { month: "5月", income: 98000, expense: 61000 },
  { month: "6月", income: 112000, expense: 70000 }
];

// 图表颜色配置
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

const chartConfig = {
  income: {
    label: "收入",
    color: "hsl(var(--primary))",
  },
  expense: {
    label: "支出", 
    color: "hsl(var(--secondary))",
  },
};

const mainStats = [
  {
    title: "项目完成率",
    value: "78%",
    subtitle: "本月项目进度",
    icon: TrendingUp,
    color: "blue" as const,
    trend: { value: "12%", isPositive: true }
  },
  {
    title: "营业收入",
    value: "¥286,500",
    subtitle: "本月收入统计",
    icon: DollarSign,
    color: "green" as const,
    trend: { value: "8.2%", isPositive: true }
  },
  {
    title: "活跃客户",
    value: "1,245",
    subtitle: "当前活跃客户数",
    icon: Users,
    color: "purple" as const,
    trend: { value: "15%", isPositive: true }
  },
  {
    title: "工人数量",
    value: "42",
    subtitle: "在职工人统计",
    icon: User,
    color: "orange" as const,
    trend: { value: "3", isPositive: true }
  }
];

const secondaryStats = [
  {
    title: "在建项目",
    value: "12",
    subtitle: "进行中项目",
    icon: Zap,
    color: "yellow" as const
  },
  {
    title: "已完项目", 
    value: "8",
    subtitle: "本月完成",
    icon: CheckCircle,
    color: "green" as const
  },
  {
    title: "未开项目",
    value: "4", 
    subtitle: "待开工项目",
    icon: Calendar,
    color: "red" as const
  },
  {
    title: "立项上周",
    value: "6",
    subtitle: "新增项目",
    icon: Package,
    color: "blue" as const
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
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
            <button 
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth"
            >
              + 新建项目
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
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
              <select className="text-sm border border-border rounded-lg px-3 py-1 bg-card text-foreground">
                <option>本月</option>
                <option>本季度</option>
                <option>本年</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryStats.map((stat, index) => (
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
                    data={projectProgressData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {projectProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {projectProgressData.map((item, index) => (
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
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData}>
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
                    tickFormatter={(value) => `¥${value/1000}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [
                      `¥${value.toLocaleString()}`,
                      name === 'income' ? '收入' : '支出'
                    ]}
                  />
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-foreground">收入</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm text-foreground">支出</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}