import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSuppliers, type Supplier } from "@/hooks/useSuppliers";

interface EditSupplierDialogProps {
  supplier: Supplier;
  children: React.ReactNode;
}

interface SupplierFormData {
  name: string;
  supplierType: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  status: string;
  notes: string;
}

export function EditSupplierDialog({ supplier, children }: EditSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: supplier.name,
    supplierType: supplier.supplier_type,
    contactPerson: supplier.contact_person || "",
    phone: supplier.phone || "",
    email: supplier.email || "",
    location: supplier.location || "",
    status: supplier.status,
    notes: supplier.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateSupplier } = useSuppliers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.supplierType) {
      toast({
        title: "错误",
        description: "请填写供应商名称和类型",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateSupplier(supplier.id, {
        name: formData.name,
        supplier_type: formData.supplierType,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        status: formData.status,
        notes: formData.notes,
      });

      toast({
        title: "成功",
        description: "供应商信息更新成功！",
      });

      setOpen(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: "错误",
        description: "更新供应商信息失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>编辑供应商</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">供应商名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入供应商名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierType">供应商类型 *</Label>
              <Select value={formData.supplierType} onValueChange={(value) => handleInputChange("supplierType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择供应商类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="建材供应商">建材供应商</SelectItem>
                  <SelectItem value="五金供应商">五金供应商</SelectItem>
                  <SelectItem value="电器供应商">电器供应商</SelectItem>
                  <SelectItem value="装饰材料">装饰材料</SelectItem>
                  <SelectItem value="工具设备">工具设备</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">联系人</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                placeholder="请输入联系人姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="邮箱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">合作状态</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择合作状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="潜在">潜在</SelectItem>
                  <SelectItem value="合作中">合作中</SelectItem>
                  <SelectItem value="暂停">暂停</SelectItem>
                  <SelectItem value="停止合作">停止合作</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">地址</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="请输入供应商地址"
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
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "更新中..." : "更新供应商"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}