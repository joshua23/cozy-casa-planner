import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TeamAssignmentFormData {
  projectId: string;
  workScope: string;
  contractAmount: string;
  startDate: string;
  endDate: string;
}

interface Team {
  id: number;
  name: string;
  leader: string;
  members: number;
  currentProjects: number;
  completedProjects: number;
  specialties: string[];
  status: string;
  efficiency: number;
  rating: number;
}

interface TeamAssignDialogProps {
  team: Team;
  children: React.ReactNode;
}

export function TeamAssignDialog({ team, children }: TeamAssignDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<TeamAssignmentFormData>({
    projectId: "",
    workScope: "",
    contractAmount: "",
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
    
    if (!formData.projectId || !formData.workScope) {
      toast({
        title: "错误",
        description: "请选择项目并填写工作范围",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would create a team assignment in Supabase
      const selectedProject = projects.find(p => p.id === formData.projectId);
      toast({
        title: "分配成功",
        description: `${team.name} 已分配到项目 ${selectedProject?.name}`,
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

  const handleInputChange = (field: keyof TeamAssignmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>分配项目 - {team.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">队长: {team.leader}</p>
            <p className="text-sm text-muted-foreground">团队成员: {team.members}人</p>
            <p className="text-sm text-muted-foreground">
              专业领域: {team.specialties.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground">工作效率: {team.efficiency}%</p>
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
            <Label htmlFor="workScope">工作范围 *</Label>
            <Textarea
              id="workScope"
              value={formData.workScope}
              onChange={(e) => handleInputChange("workScope", e.target.value)}
              placeholder="请描述团队负责的具体工作范围和要求"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractAmount">合同金额 (元)</Label>
            <Input
              id="contractAmount"
              type="number"
              value={formData.contractAmount}
              onChange={(e) => handleInputChange("contractAmount", e.target.value)}
              placeholder="请输入合同金额"
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