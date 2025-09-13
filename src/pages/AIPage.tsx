import { Bot, Plus, Search, Zap, BarChart3, Settings, MessageCircle, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AIPage() {
  const { toast } = useToast();
  const aiFeatures = [
    {
      id: 1,
      title: "智能项目分析",
      description: "基于历史数据分析项目风险和预期收益",
      status: "运行中",
      lastUpdate: "2024-01-20 14:30",
      accuracy: "94%",
      icon: BarChart3,
      color: "stat-blue"
    },
    {
      id: 2,
      title: "自动材料采购",
      description: "智能监控库存，自动生成采购建议",
      status: "运行中",
      lastUpdate: "2024-01-20 12:15",
      accuracy: "91%",
      icon: Bot,
      color: "stat-green"
    },
    {
      id: 3,
      title: "工期预测优化",
      description: "预测项目工期并提供优化建议",
      status: "学习中",
      lastUpdate: "2024-01-20 10:45",
      accuracy: "87%",
      icon: Brain,
      color: "stat-purple"
    },
    {
      id: 4,
      title: "客户服务助手",
      description: "智能客服机器人，24小时响应客户咨询",
      status: "运行中",
      lastUpdate: "2024-01-20 16:22",
      accuracy: "96%",
      icon: MessageCircle,
      color: "stat-orange"
    }
  ];

  const aiInsights = [
    {
      title: "项目预警",
      content: "海景别墅装修项目可能延期2-3天，建议增加人力投入",
      type: "warning",
      priority: "高"
    },
    {
      title: "材料建议",
      content: "瓷砖库存不足，建议本周内补货1500㎡",
      type: "info", 
      priority: "中"
    },
    {
      title: "成本优化",
      content: "通过优化材料采购路径，可节省成本约8%",
      type: "success",
      priority: "中"
    },
    {
      title: "客户满意度",
      content: "本月客户满意度提升12%，主要得益于沟通效率改善",
      type: "success",
      priority: "低"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "运行中": return "text-stat-green bg-stat-green/10";
      case "学习中": return "text-stat-blue bg-stat-blue/10";
      case "维护中": return "text-stat-orange bg-stat-orange/10";
      case "已停用": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning": return "border-l-stat-orange bg-stat-orange/5";
      case "info": return "border-l-stat-blue bg-stat-blue/5";
      case "success": return "border-l-stat-green bg-stat-green/5";
      case "error": return "border-l-stat-red bg-stat-red/5";
      default: return "border-l-muted-foreground bg-muted/5";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高": return "text-stat-red bg-stat-red/10";
      case "中": return "text-stat-orange bg-stat-orange/10";
      case "低": return "text-stat-green bg-stat-green/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI智能管理</h1>
              <p className="text-muted-foreground">智能化管理决策和自动化流程</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
              onClick={() => toast({
                title: "AI设置",
                description: "AI模型设置功能开发中",
              })}
            >
              <Settings className="w-4 h-4" />
              <span>AI设置</span>
            </button>
            <button 
              className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2"
              onClick={() => toast({
                title: "新增模型",
                description: "AI模型训练功能开发中",
              })}
            >
              <Plus className="w-4 h-4" />
              <span>新增模型</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI模型数量</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Bot className="w-8 h-8 text-stat-blue" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">运行中模型</p>
                <p className="text-2xl font-bold text-foreground">6</p>
              </div>
              <Zap className="w-8 h-8 text-stat-green" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均准确率</p>
                <p className="text-2xl font-bold text-foreground">92%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-stat-purple" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">处理任务</p>
                <p className="text-2xl font-bold text-foreground">1,456</p>
              </div>
              <div className="w-8 h-8 bg-stat-orange/10 rounded-lg flex items-center justify-center">
                <span className="text-stat-orange font-bold text-sm">任</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI功能模块</h3>
            <div className="space-y-4">
              {aiFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${feature.color}/10 rounded-lg flex items-center justify-center`}>
                      <feature.icon className={`w-5 h-5 text-${feature.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">更新时间: {feature.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                    <p className="text-sm text-foreground mt-1">准确率: {feature.accuracy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI智能洞察</h3>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI模型性能趋势</h3>
            <ChartContainer config={{
              accuracy: { label: "准确率", color: "hsl(var(--primary))" },
              efficiency: { label: "效率", color: "hsl(var(--secondary))" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: "1月", accuracy: 89, efficiency: 85 },
                  { month: "2月", accuracy: 91, efficiency: 88 },
                  { month: "3月", accuracy: 93, efficiency: 90 },
                  { month: "4月", accuracy: 92, efficiency: 92 },
                  { month: "5月", accuracy: 94, efficiency: 94 },
                  { month: "6月", accuracy: 96, efficiency: 96 }
                ]}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    domain={[80, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">任务处理统计</h3>
            <ChartContainer config={{
              tasks: { label: "处理任务", color: "hsl(var(--primary))" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { day: "周一", tasks: 142 },
                  { day: "周二", tasks: 158 },
                  { day: "周三", tasks: 173 },
                  { day: "周四", tasks: 189 },
                  { day: "周五", tasks: 205 },
                  { day: "周六", tasks: 167 },
                  { day: "周日", tasks: 134 }
                ]}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}