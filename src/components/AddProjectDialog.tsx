import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

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

interface ProjectPhaseTemplate {
  name: string;
  description: string;
  estimatedDuration: number;
  selected: boolean;
}

const defaultPhases: ProjectPhaseTemplate[] = [
  { name: '跟进洽谈', description: '项目前期沟通、需求确认、合同签订等', estimatedDuration: 3, selected: true },
  { name: '设计阶段', description: '量房、设计方案、效果图制作、方案确认', estimatedDuration: 14, selected: true },
  { name: '拆除阶段', description: '原有装修拆除、垃圾清理', estimatedDuration: 3, selected: true },
  { name: '水电改造', description: '水电线路改造、开槽布线', estimatedDuration: 7, selected: true },
  { name: '泥瓦工程', description: '防水、贴砖、地面找平等', estimatedDuration: 10, selected: true },
  { name: '木工阶段', description: '吊顶、柜体制作、木工装饰', estimatedDuration: 12, selected: true },
  { name: '油漆涂料', description: '墙面处理、刷漆、贴壁纸', estimatedDuration: 8, selected: true },
  { name: '安装阶段', description: '灯具、开关插座、洁具安装', estimatedDuration: 5, selected: true },
  { name: '软装配饰', description: '家具摆放、装饰品安装', estimatedDuration: 3, selected: true },
  { name: '收尾阶段', description: '清洁、验收、整改', estimatedDuration: 2, selected: true },
  { name: '已完工', description: '项目交付、售后服务', estimatedDuration: 1, selected: true },
];

export function AddProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phases, setPhases] = useState<ProjectPhaseTemplate[]>(defaultPhases);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    clientName: "",
    clientPhone: "",
    projectAddress: "",
    propertyType: "",
    decorationStyle: "",
    area: "",
    contractAmount: "",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();
  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.name || !formData.clientName || !formData.contractAmount) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    // 验证至少选择一个阶段
    if (!phases.some(phase => phase.selected)) {
      toast({
        title: "错误",
        description: "请至少选择一个项目阶段",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        name: formData.name,
        client_name: formData.clientName,
        client_phone: formData.clientPhone || null,
        project_address: formData.projectAddress || null,
        property_type: formData.propertyType || null,
        decoration_style: formData.decorationStyle || null,
        area: formData.area ? parseFloat(formData.area) : null,
        total_contract_amount: formData.contractAmount ? parseFloat(formData.contractAmount) : null,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        status: "设计中",
      };

      await createProject(projectData);

      toast({
        title: "成功",
        description: "项目创建成功！",
      });

      // 重置表单并关闭对话框
      setFormData({
        name: "",
        clientName: "",
        clientPhone: "",
        projectAddress: "",
        propertyType: "",
        decorationStyle: "",
        area: "",
        contractAmount: "",
        startDate: "",
        endDate: "",
      });
      setPhases(defaultPhases);
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "创建项目失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新建项目</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建装修项目</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">项目名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入项目名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">客户姓名 *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="请输入客户姓名"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">客户电话</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                placeholder="请输入客户电话"
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
              <Label htmlFor="decorationStyle">装修风格</Label>
              <Input
                id="decorationStyle"
                value={formData.decorationStyle}
                onChange={(e) => handleInputChange("decorationStyle", e.target.value)}
                placeholder="如：现代简约、中式、欧式等"
              />
            </div>
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
              <Label htmlFor="contractAmount">合同总价 (元) *</Label>
              <Input
                id="contractAmount"
                type="number"
                value={formData.contractAmount}
                onChange={(e) => handleInputChange("contractAmount", e.target.value)}
                placeholder="请输入合同总价"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">开工日期</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">预计完工日期</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* 项目阶段配置 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>项目阶段配置</Label>
              <p className="text-sm text-muted-foreground">选择适用于此项目的阶段，可以调整预计工期</p>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {phases.map((phase, index) => (
                <div key={phase.name} className="flex items-center space-x-3 p-2 border rounded">
                  <Checkbox
                    checked={phase.selected}
                    onCheckedChange={(checked) => {
                      const newPhases = [...phases];
                      newPhases[index].selected = checked as boolean;
                      setPhases(newPhases);
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{phase.name}</div>
                    <div className="text-xs text-muted-foreground">{phase.description}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      value={phase.estimatedDuration}
                      onChange={(e) => {
                        const newPhases = [...phases];
                        newPhases[index].estimatedDuration = parseInt(e.target.value) || 1;
                        setPhases(newPhases);
                      }}
                      className="w-16 text-center"
                      disabled={!phase.selected}
                    />
                    <span className="text-xs text-muted-foreground">天</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建项目"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}