import { Users, Plus, Search, Mail, Phone, Calendar, Home, User, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "潜在" | "洽谈中" | "已签约" | "已完成" | "流失";
  preliminaryBudget?: number;
  decorationStyle?: string;
  propertyType?: string;
  designerInCharge?: string;
  responsiblePerson?: string;
  lastContactDate: string;
  notes?: string;
}

export default function CustomersPage() {
  const customers: Customer[] = [
    { 
      id: 1, 
      name: "张先生", 
      phone: "138****8888", 
      email: "zhang@email.com", 
      status: "已签约",
      preliminaryBudget: 1200000,
      decorationStyle: "现代简约",
      propertyType: "别墅",
      designerInCharge: "陈设计师",
      responsiblePerson: "李经理",
      lastContactDate: "2024-01-15",
      notes: "对设计方案很满意，已确定合作"
    },
    { 
      id: 2, 
      name: "李女士", 
      phone: "139****9999", 
      email: "li@email.com", 
      status: "洽谈中",
      preliminaryBudget: 450000,
      decorationStyle: "北欧风",
      propertyType: "平层",
      designerInCharge: "王设计师",
      responsiblePerson: "张经理",
      lastContactDate: "2024-01-20",
      notes: "正在比较不同装修公司的方案"
    },
    { 
      id: 3, 
      name: "王总", 
      phone: "137****7777", 
      email: "wang@company.com", 
      status: "已完成",
      preliminaryBudget: 800000,
      decorationStyle: "中式",
      propertyType: "办公室",
      designerInCharge: "陈设计师",
      responsiblePerson: "李经理",
      lastContactDate: "2024-01-10",
      notes: "项目已完工，客户满意度很高"
    },
    { 
      id: 4, 
      name: "赵女士", 
      phone: "136****3333", 
      email: "zhao@email.com", 
      status: "潜在",
      preliminaryBudget: 300000,
      decorationStyle: "简约",
      propertyType: "小商品",
      responsiblePerson: "刘经理",
      lastContactDate: "2024-01-22",
      notes: "刚开始了解装修市场，需要引导"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已签约": return "text-stat-green bg-stat-green/10";
      case "洽谈中": return "text-stat-orange bg-stat-orange/10";
      case "潜在": return "text-stat-blue bg-stat-blue/10";
      case "已完成": return "text-stat-purple bg-stat-purple/10";
      case "流失": return "text-stat-red bg-stat-red/10";
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
        <div className="grid gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-elevated transition-all duration-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">客户状态</p>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">初步预算</p>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium text-foreground">
                            {customer.preliminaryBudget ? `¥${(customer.preliminaryBudget / 10000).toFixed(0)}万` : "待定"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">装修风格</p>
                        <span className="text-sm text-foreground">{customer.decorationStyle || "待定"}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">户型结构</p>
                        <div className="flex items-center space-x-1">
                          <Home className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.propertyType || "待定"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {customer.designerInCharge && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">负责设计师</p>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span className="text-sm text-foreground">{customer.designerInCharge}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">跟踪负责人</p>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.responsiblePerson}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">最后联系日期</p>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.lastContactDate}</span>
                        </div>
                      </div>
                    </div>

                    {customer.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-1">备注</p>
                        <p className="text-sm text-foreground">{customer.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      联系客户
                    </Button>
                    <Button size="sm">
                      查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}