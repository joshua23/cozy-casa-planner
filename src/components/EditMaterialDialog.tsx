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
  stock: string;
  unit: string;
  price: string;
  supplier: string;
}

interface Material {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  supplier: string;
  status: string;
  trend: string;
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
    stock: material.stock.toString(),
    unit: material.unit,
    price: material.price.toString(),
    supplier: material.supplier,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.stock || !formData.price) {
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
              <Label htmlFor="stock">库存数量 *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="请输入库存数量"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">单价 (元) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="请输入单价"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">供应商</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              placeholder="请输入供应商名称"
            />
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