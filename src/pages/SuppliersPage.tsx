import { Store, Plus, Search, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddSupplierDialog } from "@/components/AddSupplierDialog";
import { EditSupplierDialog } from "@/components/EditSupplierDialog";
import { ContactDialog } from "@/components/ContactDialog";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SuppliersPage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { suppliers, loading, error } = useSuppliers();

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载供应商数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载供应商数据失败：{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "合作中": return "text-stat-green bg-stat-green/10";
      case "潜在": return "text-stat-blue bg-stat-blue/10";
      case "暂停": return "text-stat-orange bg-stat-orange/10";
      case "停止合作": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.supplier_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.location && supplier.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">供应商管理</h1>
              <p className="text-muted-foreground">管理材料供应商信息和合作状态</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索供应商..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddSupplierDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {suppliers.length === 0 ? "还没有供应商，点击上方按钮添加第一个供应商" : "没有找到匹配的供应商"}
            </p>
            {suppliers.length === 0 && <AddSupplierDialog />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{supplier.supplier_type}</p>
                    </div>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supplier.location && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{supplier.location}</span>
                    </div>
                  )}
                  
                  {supplier.contact_person && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>联系人：{supplier.contact_person}</span>
                    </div>
                  )}

                  {supplier.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}


                  {supplier.notes && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">备注：</p>
                      <p className="text-xs">{supplier.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setContactInfo({
                          name: supplier.contact_person || supplier.name,
                          phone: supplier.phone || ""
                        });
                        setContactDialogOpen(true);
                      }}
                    >
                      联系
                    </Button>
                    <EditSupplierDialog supplier={supplier}>
                      <Button size="sm">
                        编辑
                      </Button>
                    </EditSupplierDialog>
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