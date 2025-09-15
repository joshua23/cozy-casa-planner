import { Users, Plus, Search, Mail, Phone, Calendar, Home, User, DollarSign, Edit } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
import { ContactDialog } from "@/components/ContactDialog";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { customers, loading, error } = useCustomers();

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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">加载失败: {error}</div>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">暂无客户数据</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {customers.filter(customer =>
              customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.phone?.includes(searchTerm) ||
              customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
                            {customer.preliminary_budget ? `￥${(customer.preliminary_budget / 10000).toFixed(0)}万` : "待定"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">装修风格</p>
                        <span className="text-sm text-foreground">{customer.decoration_style || "待定"}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">户型结构</p>
                        <div className="flex items-center space-x-1">
                          <Home className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.property_type || "待定"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {customer.designer_in_charge && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">负责设计师</p>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span className="text-sm text-foreground">{customer.designer_in_charge}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">工地负责人</p>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.responsible_person}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">最后联系日期</p>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm text-foreground">{customer.last_contact_date}</span>
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
                    <EditCustomerDialog customer={customer}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>编辑</span>
                      </Button>
                    </EditCustomerDialog>
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
          ))}
          </div>
        )}
      </div>
      
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contactInfo={contactInfo}
      />
    </div>
  );
}