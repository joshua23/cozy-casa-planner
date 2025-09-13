import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaterialFormData {
  name: string;
  category: string;
  unit: string;
  unitPrice: string;
  currentStock: string;
  minStockAlert: string;
  supplierName: string;
  supplierContact: string;
}

export function AddMaterialDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<MaterialFormData>({
    name: "",
    category: "",
    unit: "",
    unitPrice: "",
    currentStock: "",
    minStockAlert: "",
    supplierName: "",
    supplierContact: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.unit) {
      toast({
        title: "错误",
        description: "请填写材料名称、分类和单位",
        variant: "destructive",
      });
      return;
    }

    console.log("新增材料:", formData);
    
    toast({
      title: "成功",
      description: "材料添加成功！",
    });

    setFormData({
      name: "",
      category: "",
      unit: "",
      unitPrice: "",
      currentStock: "",
      minStockAlert: "",
      supplierName: "",
      supplierContact: "",
    });
    setOpen(false);
  };

  const handleInputChange = (field: keyof MaterialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新增材料</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增材料信息</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">材料名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入材料名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">材料分类 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择材料分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="地面材料">地面材料</SelectItem>
                  <SelectItem value="墙面材料">墙面材料</SelectItem>
                  <SelectItem value="电器设备">电器设备</SelectItem>
                  <SelectItem value="基础材料">基础材料</SelectItem>
                  <SelectItem value="五金配件">五金配件</SelectItem>
                  <SelectItem value="装饰材料">装饰材料</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">计量单位 *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择计量单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="㎡">平方米 (㎡)</SelectItem>
                  <SelectItem value="个">个</SelectItem>
                  <SelectItem value="桶">桶</SelectItem>
                  <SelectItem value="吨">吨</SelectItem>
                  <SelectItem value="米">米</SelectItem>
                  <SelectItem value="包">包</SelectItem>
                  <SelectItem value="套">套</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">单价 (元)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                placeholder="请输入单价"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStock">当前库存</Label>
              <Input
                id="currentStock"
                type="number"
                step="0.01"
                value={formData.currentStock}
                onChange={(e) => handleInputChange("currentStock", e.target.value)}
                placeholder="请输入当前库存"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStockAlert">库存预警值</Label>
              <Input
                id="minStockAlert"
                type="number"
                step="0.01"
                value={formData.minStockAlert}
                onChange={(e) => handleInputChange("minStockAlert", e.target.value)}
                placeholder="请输入库存预警值"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierName">供应商名称</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => handleInputChange("supplierName", e.target.value)}
                placeholder="请输入供应商名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierContact">供应商联系方式</Label>
              <Input
                id="supplierContact"
                value={formData.supplierContact}
                onChange={(e) => handleInputChange("supplierContact", e.target.value)}
                placeholder="请输入供应商联系方式"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              添加材料
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}