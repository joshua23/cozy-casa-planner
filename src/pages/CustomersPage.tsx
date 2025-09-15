import { Users, Plus, Search, Mail, Phone, Calendar, Home, User, DollarSign } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { ContactDialog } from "@/components/ContactDialog";
import { useNavigate } from "react-router-dom";
import { useCustomers, type Customer as DBCustomer } from "@/hooks/useCustomers";

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
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { customers, loading, error } = useCustomers();

  // 示例数据，用于演示UI结构
  const sampleCustomers: Customer[] = [
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

  // 转换数据库客户数据为显示格式
  const displayCustomers = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone || "未提供",
    email: customer.email || "未提供",
    status: customer.status as "潜在" | "洽谈中" | "已签约" | "已完成" | "流失",
    preliminaryBudget: customer.preliminary_budget,
    decorationStyle: customer.decoration_style,
    propertyType: customer.property_type,
    designerInCharge: customer.designer_in_charge,
    responsiblePerson: customer.responsible_person,
    lastContactDate: customer.last_contact_date || "未记录",
    notes: customer.notes,
  }));

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载客户数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载客户数据失败：{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    );
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddCustomerDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-6">
          {displayCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">还没有客户记录，点击上方按钮添加第一个客户</p>
              <AddCustomerDialog />
            </div>
          ) : (
            displayCustomers.filter(customer =>
              customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.phone.includes(searchTerm) ||
              customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.status.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((customer) => (
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContactInfo({
                          name: customer.name,
                          phone: customer.phone,
                          email: customer.email
                        });
                        setContactDialogOpen(true);
                      }}
                    >
                      联系客户
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/projects')}
                    >
                      查看项目
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
      
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contactInfo={contactInfo}
      />
    </div>
  );
}