import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, type Customer } from "@/hooks/useCustomers";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  preliminaryBudget: string;
  decorationStyle: string;
  propertyType: string;
  designerInCharge: string;
  responsiblePerson: string;
  status: string;
  notes: string;
}

interface EditCustomerDialogProps {
  customer: Customer;
  children: React.ReactNode;
}

export function EditCustomerDialog({ customer, children }: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer.name || "",
    phone: customer.phone || "",
    email: customer.email || "",
    preliminaryBudget: customer.preliminary_budget ? customer.preliminary_budget.toString() : "",
    decorationStyle: customer.decoration_style || "",
    propertyType: customer.property_type || "",
    designerInCharge: customer.designer_in_charge || "",
    responsiblePerson: customer.responsible_person || "",
    status: customer.status || "潜在",
    notes: customer.notes || "",
  });
  const { toast } = useToast();
  const { updateCustomer } = useCustomers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "错误",
        description: "请填写客户姓名和联系电话",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await updateCustomer(customer.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        preliminary_budget: formData.preliminaryBudget ? parseFloat(formData.preliminaryBudget) : null,
        decoration_style: formData.decorationStyle || null,
        property_type: formData.propertyType || null,
        designer_in_charge: formData.designerInCharge || null,
        responsible_person: formData.responsiblePerson || null,
        status: formData.status as any,
        notes: formData.notes || null,
        last_contact_date: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "成功",
        description: "客户信息更新成功！",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "更新客户失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑客户信息</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">客户姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入客户姓名"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="请输入联系电话"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="邮箱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">客户状态</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择客户状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="潜在">潜在</SelectItem>
                  <SelectItem value="洽谈中">洽谈中</SelectItem>
                  <SelectItem value="已签约">已签约</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="流失">流失</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preliminaryBudget">初步预算 (元)</Label>
              <Input
                id="preliminaryBudget"
                type="number"
                value={formData.preliminaryBudget}
                onChange={(e) => handleInputChange("preliminaryBudget", e.target.value)}
                placeholder="请输入初步预算"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decorationStyle">装修风格</Label>
              <Input
                id="decorationStyle"
                value={formData.decorationStyle}
                onChange={(e) => handleInputChange("decorationStyle", e.target.value)}
                placeholder="如：现代简约、北欧风等"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">户型结构</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择户型结构" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="平层">平层</SelectItem>
                  <SelectItem value="小商品">小商品</SelectItem>
                  <SelectItem value="别墅">别墅</SelectItem>
                  <SelectItem value="办公室">办公室</SelectItem>
                  <SelectItem value="商业空间">商业空间</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designerInCharge">负责设计师</Label>
              <Input
                id="designerInCharge"
                value={formData.designerInCharge}
                onChange={(e) => handleInputChange("designerInCharge", e.target.value)}
                placeholder="请输入负责设计师"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">工地负责人</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange("responsiblePerson", e.target.value)}
                placeholder="请输入工地负责人"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">备注信息</Label>
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
              {loading ? "更新中..." : "更新客户"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}