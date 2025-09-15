import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormData {
  name: string;
  clientName: string;
  clientPhone: string;
  projectAddress: string;
  propertyType: string;
  decorationStyle: string;
  area: string;
  contractAmount: string;
  startDate: string;
  endDate: string;
}

interface Project {
  id: number;
  name: string;
  status: string;
  client: string;
  deadline: string;
  contractAmount: number;
  propertyType: string;
  decorationStyle: string;
  area: number;
}

interface EditProjectDialogProps {
  project: Project;
  children: React.ReactNode;
}

export function EditProjectDialog({ project, children }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project.name,
    clientName: project.client,
    clientPhone: "",
    projectAddress: "",
    propertyType: project.propertyType,
    decorationStyle: project.decorationStyle,
    area: project.area.toString(),
    contractAmount: project.contractAmount.toString(),
    startDate: "",
    endDate: project.deadline,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.clientName || !formData.contractAmount) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would update the project in Supabase
      toast({
        title: "成功",
        description: `项目 ${formData.name} 已更新`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "更新项目失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>编辑项目</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">项目名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入项目名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">客户姓名 *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="请输入客户姓名"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">联系电话</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectAddress">项目地址</Label>
              <Input
                id="projectAddress"
                value={formData.projectAddress}
                onChange={(e) => handleInputChange("projectAddress", e.target.value)}
                placeholder="请输入项目地址（小区名称、门牌号等）"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">户型结构</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择户型结构" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="一居室">一居室</SelectItem>
                  <SelectItem value="两居室">两居室</SelectItem>
                  <SelectItem value="三居室">三居室</SelectItem>
                  <SelectItem value="四居室">四居室</SelectItem>
                  <SelectItem value="复式">复式</SelectItem>
                  <SelectItem value="别墅">别墅</SelectItem>
                  <SelectItem value="平层">平层</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decorationStyle">装修风格</Label>
              <Select value={formData.decorationStyle} onValueChange={(value) => handleInputChange("decorationStyle", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择装修风格" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="现代简约">现代简约</SelectItem>
                  <SelectItem value="中式">中式</SelectItem>
                  <SelectItem value="欧式">欧式</SelectItem>
                  <SelectItem value="美式">美式</SelectItem>
                  <SelectItem value="北欧风">北欧风</SelectItem>
                  <SelectItem value="地中海">地中海</SelectItem>
                  <SelectItem value="田园风">田园风</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">面积 (㎡)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
                placeholder="请输入面积"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractAmount">合同金额 (元) *</Label>
              <Input
                id="contractAmount"
                type="number"
                value={formData.contractAmount}
                onChange={(e) => handleInputChange("contractAmount", e.target.value)}
                placeholder="请输入合同金额"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">结束日期</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              更新项目
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}