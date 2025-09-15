import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MaterialFormData {
  name: string;
  category: string;
  current_stock: string;
  unit: string;
  unit_price: string;
  supplier_name: string;
  min_stock_alert: string;
}

interface Material {
  id: string;
  name: string;
  category: string;
  current_stock: number | null;
  unit: string;
  unit_price: number | null;
  supplier_name: string | null;
  min_stock_alert: number | null;
}

interface EditMaterialDialogProps {
  material: Material;
  children: React.ReactNode;
}

export function EditMaterialDialog({ material, children }: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<MaterialFormData>({
    name: material.name,
    category: material.category,
    current_stock: (material.current_stock || 0).toString(),
    unit: material.unit,
    unit_price: (material.unit_price || 0).toString(),
    supplier_name: material.supplier_name || "",
    min_stock_alert: (material.min_stock_alert || 0).toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.current_stock || !formData.unit_price) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would update the material in Supabase
      toast({
        title: "成功",
        description: `材料 ${formData.name} 已更新`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "更新材料失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof MaterialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑材料</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">材料名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="请输入材料名称"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">材料分类 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择材料分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="基础材料">基础材料</SelectItem>
                  <SelectItem value="地面材料">地面材料</SelectItem>
                  <SelectItem value="墙面材料">墙面材料</SelectItem>
                  <SelectItem value="电器设备">电器设备</SelectItem>
                  <SelectItem value="五金配件">五金配件</SelectItem>
                  <SelectItem value="门窗材料">门窗材料</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">计量单位 *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个">个</SelectItem>
                  <SelectItem value="㎡">㎡</SelectItem>
                  <SelectItem value="米">米</SelectItem>
                  <SelectItem value="吨">吨</SelectItem>
                  <SelectItem value="桶">桶</SelectItem>
                  <SelectItem value="袋">袋</SelectItem>
                  <SelectItem value="套">套</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_stock">库存数量 *</Label>
              <Input
                id="current_stock"
                type="number"
                value={formData.current_stock}
                onChange={(e) => handleInputChange("current_stock", e.target.value)}
                placeholder="请输入库存数量"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">单价 (元) *</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => handleInputChange("unit_price", e.target.value)}
                placeholder="请输入单价"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_name">供应商</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => handleInputChange("supplier_name", e.target.value)}
                placeholder="请输入供应商名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock_alert">库存预警值</Label>
              <Input
                id="min_stock_alert"
                type="number"
                value={formData.min_stock_alert}
                onChange={(e) => handleInputChange("min_stock_alert", e.target.value)}
                placeholder="请输入库存预警值"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              更新材料
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}