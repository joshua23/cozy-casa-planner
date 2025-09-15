import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomers } from "@/hooks/useCustomers";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  preliminaryBudget: string;
  decorationStyle: string;
  propertyType: string;
  designerInCharge: string;
  responsiblePerson: string;
  acquisitionSource: string;
  notes: string;
}

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    preliminaryBudget: "",
    decorationStyle: "",
    propertyType: "",
    designerInCharge: "",
    responsiblePerson: "",
    acquisitionSource: "",
    notes: "",
  });
  const { toast } = useToast();
  const { createCustomer } = useCustomers();

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
      await createCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        preliminary_budget: formData.preliminaryBudget ? parseFloat(formData.preliminaryBudget) : null,
        decoration_style: formData.decorationStyle || null,
        property_type: formData.propertyType || null,
        designer_in_charge: formData.designerInCharge || null,
        responsible_person: formData.responsiblePerson || null,
        acquisition_source: formData.acquisitionSource || null,
        notes: formData.notes || null,
        status: "潜在",
        last_contact_date: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "成功",
        description: "客户信息添加成功！",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        preliminaryBudget: "",
        decorationStyle: "",
        propertyType: "",
        designerInCharge: "",
        responsiblePerson: "",
        acquisitionSource: "",
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "添加客户失败",
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
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新增客户</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新增客户信息</DialogTitle>
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
                placeholder="请输入邮箱地址"
              />
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
              <Label htmlFor="responsiblePerson">跟踪负责人</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange("responsiblePerson", e.target.value)}
                placeholder="请输入跟踪负责人"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acquisitionSource">获客来源</Label>
              <Select value={formData.acquisitionSource} onValueChange={(value) => handleInputChange("acquisitionSource", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择获客来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="线上推广">线上推广</SelectItem>
                  <SelectItem value="朋友推荐">朋友推荐</SelectItem>
                  <SelectItem value="老客户介绍">老客户介绍</SelectItem>
                  <SelectItem value="展会活动">展会活动</SelectItem>
                  <SelectItem value="门店咨询">门店咨询</SelectItem>
                  <SelectItem value="电话销售">电话销售</SelectItem>
                  <SelectItem value="社交媒体">社交媒体</SelectItem>
                  <SelectItem value="其他渠道">其他渠道</SelectItem>
                </SelectContent>
              </Select>
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
              {loading ? "添加中..." : "添加客户"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}