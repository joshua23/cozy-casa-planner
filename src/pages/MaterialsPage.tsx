import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { AddMaterialDialog } from "@/components/AddMaterialDialog";
import { EditMaterialDialog } from "@/components/EditMaterialDialog";
import { RestockDialog } from "@/components/RestockDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMaterials } from "@/hooks/useMaterials";

export default function MaterialsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { materials, loading, error, fetchMaterials } = useMaterials();

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
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">材料管理</h1>
              <p className="text-sm md:text-base text-muted-foreground">管理装修材料库存和供应商信息</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索材料..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddMaterialDialog onMaterialAdded={fetchMaterials} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">总材料种类</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">248</p>
              </div>
              <Package className="w-6 h-6 md:w-8 md:h-8 text-stat-blue flex-shrink-0" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">库存总值</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">¥1.2M</p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-stat-green flex-shrink-0" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">供应商数量</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">32</p>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-stat-purple/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-stat-purple font-bold text-sm md:text-base">供</span>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">库存预警</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">5</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-stat-orange flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border">
            <h3 className="text-base md:text-lg font-semibold text-foreground">材料库存列表</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-destructive">加载失败: {error}</div>
            </div>
          ) : materials.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">暂无材料数据</div>
            </div>
          ) : (
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
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {materials
                    .filter(material =>
                      material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      material.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      material.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((material) => (
                  <tr key={material.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3 md:p-4">
                      <div className="font-medium text-foreground text-sm md:text-base truncate">{material.name}</div>
                    </td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-muted-foreground truncate">{material.category}</td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-foreground">
                      {material.current_stock || 0} {material.unit}
                    </td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-foreground">¥{material.unit_price || 0}</td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-muted-foreground truncate">{material.supplier_name}</td>
                    <td className="p-3 md:p-4">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        (material.current_stock || 0) <= (material.min_stock_alert || 0) ? "库存不足" :
                        (material.current_stock || 0) <= (material.min_stock_alert || 0) * 2 ? "正常" : "充足"
                      )}`}>
                        {(material.current_stock || 0) <= (material.min_stock_alert || 0) ? "库存不足" :
                         (material.current_stock || 0) <= (material.min_stock_alert || 0) * 2 ? "正常" : "充足"}
                      </span>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <EditMaterialDialog material={material}>
                          <button className="px-2 md:px-3 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">
                            编辑
                          </button>
                        </EditMaterialDialog>
                        <RestockDialog material={material}>
                          <button className="px-2 md:px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
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
          )}
        </div>
      </div>
    </div>
  );
}