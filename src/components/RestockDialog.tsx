import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface RestockFormData {
  quantity: string;
  unitPrice: string;
  supplier: string;
  deliveryDate: string;
  notes: string;
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

interface RestockDialogProps {
  material: Material;
  children: React.ReactNode;
}

export function RestockDialog({ material, children }: RestockDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setRestockData] = useState<RestockFormData>({
    quantity: "",
    unitPrice: material.price.toString(),
    supplier: material.supplier,
    deliveryDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.quantity || !formData.unitPrice) {
      toast({
        title: "错误",
        description: "请填写补货数量和单价",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would create a material transaction record in Supabase
      toast({
        title: "补货申请已提交",
        description: `${material.name} 补货 ${formData.quantity} ${material.unit}`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "补货申请失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof RestockFormData, value: string) => {
    setRestockData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>补货申请 - {material.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">当前库存: {material.stock} {material.unit}</p>
            <p className="text-sm text-muted-foreground">当前单价: ¥{material.price}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">补货数量 *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder={`请输入补货数量 (${material.unit})`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">单价 (元) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">期望到货日期</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="请输入备注信息"
              rows={3}
            />
          </div>

          {formData.quantity && formData.unitPrice && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm font-medium">
                总金额: ¥{(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              提交补货申请
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}