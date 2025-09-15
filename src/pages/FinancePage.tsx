import { DollarSign, Plus, Search, TrendingUp, TrendingDown, BarChart3, PieChart, Calculator, CreditCard } from "lucide-react";
import { AddFinanceDialog } from "@/components/AddFinanceDialog";
import { FinanceDetailDialog } from "@/components/FinanceDetailDialog";
import { EditFinanceDialog } from "@/components/EditFinanceDialog";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";

export default function FinancePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { records, loading, error } = useFinancialRecords();

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        monthlyIncome: 0,
        monthlyExpense: 0,
        netProfit: 0,
        accountBalance: 0,
        incomeGrowth: 0,
        expenseGrowth: 0,
        profitGrowth: 0
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = records
      .filter(r => r.transaction_type === '收入' && 
        new Date(r.transaction_date).getMonth() === currentMonth &&
        new Date(r.transaction_date).getFullYear() === currentYear)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const monthlyExpense = records
      .filter(r => r.transaction_type === '支出' && 
        new Date(r.transaction_date).getMonth() === currentMonth &&
        new Date(r.transaction_date).getFullYear() === currentYear)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const netProfit = monthlyIncome - monthlyExpense;
    
    // 计算账户余额（所有收入减去所有支出）
    const totalIncome = records
      .filter(r => r.transaction_type === '收入')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const totalExpense = records
      .filter(r => r.transaction_type === '支出')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const accountBalance = totalIncome - totalExpense;

    return {
      monthlyIncome,
      monthlyExpense,
      netProfit,
      accountBalance,
      incomeGrowth: 12.5, // 模拟增长率
      expenseGrowth: 8.3,
      profitGrowth: 18.7
    };
  }, [records]);

  // 生成图表数据
  const chartData = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        monthlyData: [],
        projectData: []
      };
    }

    // 按月份统计收支
    const monthlyStats: Record<string, { income: number; expense: number }> = {};
    
    records.forEach(record => {
      const date = new Date(record.transaction_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { income: 0, expense: 0 };
      }
      
      if (record.transaction_type === '收入') {
        monthlyStats[monthKey].income += record.amount || 0;
      } else {
        monthlyStats[monthKey].expense += record.amount || 0;
      }
    });

    const monthlyData = Object.entries(monthlyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: month.split('-')[1] + '月',
        income: data.income,
        expense: data.expense
      }));

    // 按项目统计收益（这里简化处理，按分类统计）
    const projectStats: Record<string, number> = {};
    records
      .filter(r => r.transaction_type === '收入')
      .forEach(record => {
        const category = record.category || '其他';
        projectStats[category] = (projectStats[category] || 0) + (record.amount || 0);
      });

    const projectData = Object.entries(projectStats)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 4);

    return { monthlyData, projectData };
  }, [records]);

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载财务数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载财务数据失败：{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    return type === "收入" ? "text-stat-green bg-stat-green/10" : "text-stat-red bg-stat-red/10";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "text-stat-green bg-stat-green/10";
      case "待处理": return "text-stat-orange bg-stat-orange/10";
      case "处理中": return "text-stat-blue bg-stat-blue/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const formatAmount = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">财务管理</h1>
              <p className="text-muted-foreground">管理项目财务和资金流水</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="搜索交易..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            </div>
            <AddFinanceDialog />
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">本月收入</p>
                <p className="text-2xl font-bold text-stat-green">¥{statistics.monthlyIncome.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-stat-green/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-stat-green" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-stat-green" />
              <span className="text-stat-green">+{statistics.incomeGrowth}%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">本月支出</p>
                <p className="text-2xl font-bold text-stat-red">¥{statistics.monthlyExpense.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-stat-red/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-stat-red" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingDown className="w-4 h-4 text-stat-red" />
              <span className="text-stat-red">+{statistics.expenseGrowth}%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">净利润</p>
                <p className="text-2xl font-bold text-foreground">¥{statistics.netProfit.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-stat-blue/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-stat-blue" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-stat-green" />
              <span className="text-stat-green">+{statistics.profitGrowth}%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">账户余额</p>
                <p className="text-2xl font-bold text-foreground">¥{statistics.accountBalance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-stat-purple/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-stat-purple" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-muted-foreground">可用资金</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">收支趋势</h3>
            </div>
            <ChartContainer config={{
              income: { label: "收入", color: "hsl(var(--primary))" },
              expense: { label: "支出", color: "hsl(var(--secondary))" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthlyData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `¥${value/1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} 
                    formatter={(value: number, name: string) => [
                      `¥${value.toLocaleString()}`,
                      name === 'income' ? '收入' : '支出'
                    ]} />
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">项目收益分析</h3>
            </div>
            <ChartContainer config={{}} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsPieChart>
                   <Pie
                     data={chartData.projectData}
                     cx="50%"
                     cy="50%"
                     outerRadius={80}
                     dataKey="value"
                     label={({ name, value, percent }) => `${name}: ¥${(value / 10000).toFixed(0)}万 (${(percent * 100).toFixed(1)}%)`}
                     labelLine={false}
                   >
                     {chartData.projectData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={
                         ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'][index]
                       } />
                     ))}
                   </Pie>
                   <ChartTooltip content={<ChartTooltipContent />} 
                     formatter={(value: number) => [
                       `¥${value.toLocaleString()}`,
                       '项目收益'
                     ]} />
                 </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">最近交易记录</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">类型</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">金额</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">分类</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">关联项目</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">日期</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">状态</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">备注</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无财务记录
                  </td>
                </tr>
              ) : (
                records
                .filter(transaction => 
                  transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${transaction.transaction_type === '收入' ? 'text-stat-green' : 'text-stat-red'}`}>
                        {transaction.transaction_type === '收入' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground">{transaction.category}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {transaction.project_display_name || transaction.project_name || "无关联项目"}
                      {transaction.project_client_name && (
                        <div className="text-xs text-muted-foreground/70">
                          客户：{transaction.project_client_name}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.transaction_date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.payment_status || "已完成")}`}>
                        {transaction.payment_status || "已完成"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {transaction.description || "无备注"}
                      {transaction.customer_name && transaction.customer_name !== transaction.project_client_name && (
                        <div className="text-xs text-muted-foreground/70">
                          关联客户：{transaction.customer_name}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <FinanceDetailDialog transaction={{
                          id: parseInt(transaction.id) || 0,
                          type: transaction.transaction_type,
                          amount: transaction.amount || 0,
                          category: transaction.category,
                          project: transaction.project_display_name || transaction.project_name || "无关联项目",
                          date: transaction.transaction_date,
                          status: transaction.payment_status || "已完成",
                          description: transaction.description || "无备注",
                          customerName: transaction.customer_name,
                          projectClientName: transaction.project_client_name
                        }}>
                          <button className="px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">
                            详情
                          </button>
                        </FinanceDetailDialog>
                        <EditFinanceDialog transaction={{
                          id: parseInt(transaction.id) || 0,
                          type: transaction.transaction_type,
                          amount: transaction.amount || 0,
                          category: transaction.category,
                          project: transaction.project_display_name || transaction.project_name || "无关联项目",
                          date: transaction.transaction_date,
                          status: transaction.payment_status || "已完成",
                          description: transaction.description || "无备注",
                          customerName: transaction.customer_name,
                          projectClientName: transaction.project_client_name
                        }}>
                          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                            编辑
                          </button>
                        </EditFinanceDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}