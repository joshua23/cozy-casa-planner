import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AssignmentFormData {
  projectId: string;
  workDescription: string;
  estimatedAmount: string;
  startDate: string;
  endDate: string;
}

interface Worker {
  id: number;
  name: string;
  type: string;
  specialties: string[];
  hourlyRate: number;
  dailyRate: number;
  status: string;
}

interface WorkerAssignDialogProps {
  worker: Worker;
  children: React.ReactNode;
}

export function WorkerAssignDialog({ worker, children }: WorkerAssignDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AssignmentFormData>({
    projectId: "",
    workDescription: "",
    estimatedAmount: "",
    startDate: "",
    endDate: "",
  });

  // Mock projects data - in real app, this would come from Supabase
  const projects = [
    { id: "1", name: "海景别墅装修", status: "进行中" },
    { id: "2", name: "现代公寓改造", status: "设计中" },
    { id: "3", name: "办公室装修", status: "待开工" },
    { id: "4", name: "商铺装修", status: "施工中" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.workDescription) {
      toast({
        title: "错误",
        description: "请选择项目并填写工作描述",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would create a worker assignment in Supabase
      const selectedProject = projects.find(p => p.id === formData.projectId);
      toast({
        title: "分配成功",
        description: `${worker.name} 已分配到项目 ${selectedProject?.name}`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "分配项目失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof AssignmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>分配项目 - {worker.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">工人类型: {worker.type}</p>
            <p className="text-sm text-muted-foreground">
              专业技能: {worker.specialties.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground">
              计费标准: ¥{worker.hourlyRate}/小时 或 ¥{worker.dailyRate}/天
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">选择项目 *</Label>
            <Select value={formData.projectId} onValueChange={(value) => handleInputChange("projectId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="请选择要分配的项目" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDescription">工作描述 *</Label>
            <Textarea
              id="workDescription"
              value={formData.workDescription}
              onChange={(e) => handleInputChange("workDescription", e.target.value)}
              placeholder="请描述具体的工作内容和要求"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedAmount">预估金额 (元)</Label>
            <Input
              id="estimatedAmount"
              type="number"
              value={formData.estimatedAmount}
              onChange={(e) => handleInputChange("estimatedAmount", e.target.value)}
              placeholder="请输入预估工作金额"
            />
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
              <Label htmlFor="endDate">预计结束日期</Label>
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
              确认分配
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}