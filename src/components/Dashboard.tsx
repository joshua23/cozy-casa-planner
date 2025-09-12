import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  User,
  Zap,
  Package,
  CheckCircle,
  Calendar
} from "lucide-react";
import StatCard from "./StatCard";

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
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth">
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
            <StatCard key={index} {...stat} />
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

        {/* Additional Sections Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">项目进度分布</h3>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
              图表区域 - 项目进度可视化
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">财务概览</h3>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
              图表区域 - 收入支出统计
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}