import { Calculator, Plus, Search, TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart } from "lucide-react";

export default function FinancePage() {
  const transactions = [
    { 
      id: 1, 
      type: "收入", 
      amount: 125000, 
      category: "项目款", 
      project: "海景别墅装修", 
      date: "2024-01-20", 
      status: "已到账",
      description: "第二期工程款"
    },
    { 
      id: 2, 
      type: "支出", 
      amount: 35000, 
      category: "材料采购", 
      project: "现代公寓改造", 
      date: "2024-01-18", 
      status: "已支付",
      description: "瓷砖和地板采购"
    },
    { 
      id: 3, 
      type: "支出", 
      amount: 28000, 
      category: "人工费", 
      project: "办公室装修", 
      date: "2024-01-15", 
      status: "已支付",
      description: "施工队工资结算"
    },
    { 
      id: 4, 
      type: "收入", 
      amount: 89000, 
      category: "设计费", 
      project: "商业空间设计", 
      date: "2024-01-12", 
      status: "已到账",
      description: "设计方案费用"
    },
    { 
      id: 5, 
      type: "支出", 
      amount: 15000, 
      category: "设备租赁", 
      project: "海景别墅装修", 
      date: "2024-01-10", 
      status: "已支付",
      description: "施工设备月租"
    },
  ];

  const getTypeColor = (type: string) => {
    return type === "收入" ? "text-stat-green bg-stat-green/10" : "text-stat-red bg-stat-red/10";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已到账":
      case "已支付": return "text-stat-green bg-stat-green/10";
      case "待到账":
      case "待支付": return "text-stat-orange bg-stat-orange/10";
      case "逾期": return "text-stat-red bg-stat-red/10";
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
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>新增记录</span>
            </button>
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
                <p className="text-2xl font-bold text-stat-green">¥286,500</p>
              </div>
              <div className="w-12 h-12 bg-stat-green/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-stat-green" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-stat-green" />
              <span className="text-stat-green">+12.5%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">本月支出</p>
                <p className="text-2xl font-bold text-stat-red">¥156,200</p>
              </div>
              <div className="w-12 h-12 bg-stat-red/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-stat-red" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingDown className="w-4 h-4 text-stat-red" />
              <span className="text-stat-red">+8.3%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">净利润</p>
                <p className="text-2xl font-bold text-foreground">¥130,300</p>
              </div>
              <div className="w-12 h-12 bg-stat-blue/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-stat-blue" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-stat-green" />
              <span className="text-stat-green">+18.7%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">账户余额</p>
                <p className="text-2xl font-bold text-foreground">¥458,900</p>
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
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">收支趋势</h3>
            </div>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
              收支趋势图表区域
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card border border-border/50">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">项目收益分析</h3>
            </div>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
              项目收益分析图表
            </div>
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${transaction.type === '收入' ? 'text-stat-green' : 'text-stat-red'}`}>
                        {transaction.type === '收入' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground">{transaction.category}</td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.project}</td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.description}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">
                          详情
                        </button>
                        <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                          编辑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}