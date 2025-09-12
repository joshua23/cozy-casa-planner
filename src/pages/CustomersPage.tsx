import { Users, Plus, Search, Mail, Phone } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "张先生", phone: "138****8888", email: "zhang@email.com", projects: 2, status: "活跃", lastContact: "2024-01-15" },
    { id: 2, name: "李女士", phone: "139****9999", email: "li@email.com", projects: 1, status: "潜在", lastContact: "2024-01-20" },
    { id: 3, name: "王总", phone: "137****7777", email: "wang@company.com", projects: 3, status: "已完成", lastContact: "2024-01-10" },
    { id: 4, name: "科技公司", phone: "010-****-8888", email: "contact@tech.com", projects: 1, status: "洽谈中", lastContact: "2024-01-22" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "活跃": return "text-stat-green bg-stat-green/10";
      case "潜在": return "text-stat-blue bg-stat-blue/10";
      case "已完成": return "text-muted-foreground bg-muted";
      case "洽谈中": return "text-stat-orange bg-stat-orange/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">客户管理</h1>
              <p className="text-muted-foreground">管理客户信息和沟通记录</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索客户..." 
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>新增客户</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-4">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">项目数量</p>
                    <p className="text-lg font-semibold text-foreground">{customer.projects}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">最后联系</p>
                    <p className="text-sm text-foreground">{customer.lastContact}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                      联系
                    </button>
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}