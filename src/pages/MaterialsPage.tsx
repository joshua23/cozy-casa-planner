import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { AddMaterialDialog } from "@/components/AddMaterialDialog";
import { EditMaterialDialog } from "@/components/EditMaterialDialog";
import { RestockDialog } from "@/components/RestockDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MaterialsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const materials = [
    { 
      id: 1, 
      name: "瓷砖", 
      category: "地面材料", 
      stock: 1200, 
      unit: "㎡", 
      price: 89.5, 
      supplier: "东鹏瓷砖", 
      status: "充足",
      trend: "up"
    },
    { 
      id: 2, 
      name: "乳胶漆", 
      category: "墙面材料", 
      stock: 45, 
      unit: "桶", 
      price: 268.0, 
      supplier: "立邦漆业", 
      status: "正常",
      trend: "stable"
    },
    { 
      id: 3, 
      name: "实木地板", 
      category: "地面材料", 
      stock: 8, 
      unit: "㎡", 
      price: 298.5, 
      supplier: "大自然地板", 
      status: "库存不足",
      trend: "down"
    },
    { 
      id: 4, 
      name: "LED灯具", 
      category: "电器设备", 
      stock: 156, 
      unit: "个", 
      price: 125.0, 
      supplier: "飞利浦照明", 
      status: "充足",
      trend: "up"
    },
    { 
      id: 5, 
      name: "水泥", 
      category: "基础材料", 
      stock: 25, 
      unit: "吨", 
      price: 420.0, 
      supplier: "海螺水泥", 
      status: "正常",
      trend: "stable"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "充足": return "text-stat-green bg-stat-green/10";
      case "正常": return "text-stat-blue bg-stat-blue/10";
      case "库存不足": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-stat-green" />;
      case "down": return <TrendingDown className="w-4 h-4 text-stat-red" />;
      default: return <div className="w-4 h-4 bg-muted-foreground/20 rounded-full" />;
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">材料管理</h1>
              <p className="text-muted-foreground">管理装修材料库存和供应商信息</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索材料..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddMaterialDialog />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总材料种类</p>
                <p className="text-2xl font-bold text-foreground">248</p>
              </div>
              <Package className="w-8 h-8 text-stat-blue" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">库存总值</p>
                <p className="text-2xl font-bold text-foreground">¥1.2M</p>
              </div>
              <TrendingUp className="w-8 h-8 text-stat-green" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">供应商数量</p>
                <p className="text-2xl font-bold text-foreground">32</p>
              </div>
              <div className="w-8 h-8 bg-stat-purple/10 rounded-lg flex items-center justify-center">
                <span className="text-stat-purple font-bold">供</span>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">库存预警</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-stat-orange" />
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">材料库存列表</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">材料名称</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">分类</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">库存</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">单价</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">供应商</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">状态</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">趋势</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {materials
                  .filter(material => 
                    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((material) => (
                  <tr key={material.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{material.name}</div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{material.category}</td>
                    <td className="p-4 text-sm text-foreground">
                      {material.stock} {material.unit}
                    </td>
                    <td className="p-4 text-sm text-foreground">¥{material.price}</td>
                    <td className="p-4 text-sm text-muted-foreground">{material.supplier}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {getTrendIcon(material.trend)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <EditMaterialDialog material={material}>
                          <button className="px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">
                            编辑
                          </button>
                        </EditMaterialDialog>
                        <RestockDialog material={material}>
                          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                            补货
                          </button>
                        </RestockDialog>
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