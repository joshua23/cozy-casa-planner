import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";

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
  onAssignmentCreated?: () => void;
}

export function WorkerAssignDialog({ worker, children, onAssignmentCreated }: WorkerAssignDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AssignmentFormData>({
    projectId: "",
    workDescription: "",
    estimatedAmount: "",
    startDate: "",
    endDate: "",
  });

  // 使用真实项目数据
  const { projects, loading: projectsLoading } = useProjects();

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
      // 创建工人分配记录到Supabase
      const { error } = await supabase
        .from('worker_assignments')
        .insert({
          worker_id: worker.id.toString(),
          project_id: formData.projectId,
          work_description: formData.workDescription,
          estimated_amount: formData.estimatedAmount ? parseFloat(formData.estimatedAmount) : null,
          start_date: formData.startDate || null,
          end_date: formData.endDate || null,
          status: '分配中'
        });

      if (error) throw error;

      const selectedProject = projects.find(p => p.id === formData.projectId);
      toast({
        title: "分配成功",
        description: `${worker.name} 已分配到项目 ${selectedProject?.name}`,
      });

      // 调用回调函数刷新数据
      if (onAssignmentCreated) {
        onAssignmentCreated();
      }

      setOpen(false);
      setFormData({
        projectId: "",
        workDescription: "",
        estimatedAmount: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error('分配工人失败:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "进行中": return "text-stat-blue bg-stat-blue/10";
      case "设计中": return "text-stat-orange bg-stat-orange/10";
      case "待开工": return "text-stat-green bg-stat-green/10";
      case "施工中": return "text-stat-purple bg-stat-purple/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>分配项目 - {worker.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">工人类型</p>
                <p className="font-medium text-foreground">{worker.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">专业技能</p>
                <p className="font-medium text-foreground">{worker.specialties.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">小时费率</p>
                <p className="font-medium text-foreground">¥{worker.hourlyRate}/小时</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">日费率</p>
                <p className="font-medium text-foreground">¥{worker.dailyRate}/天</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">可分配项目列表</h4>
            {projectsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">加载项目中...</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">暂无可分配的项目</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 border border-border rounded-lg cursor-pointer transition-all ${
                      formData.projectId === project.id
                        ? 'bg-primary/10 border-primary shadow-sm'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleInputChange("projectId", project.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-foreground">{project.name}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span>客户: {project.client_name}</span>
                          </div>
                          <div>
                            <span>截止: {project.end_date || '未设定'}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">合同金额</span>
                            <span className="font-medium">¥{(project.total_contract_amount || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      {formData.projectId === project.id && (
                        <div className="ml-4 text-primary">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {formData.projectId && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  已选择项目: {projects.find(p => p.id === formData.projectId)?.name}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={!formData.projectId || !formData.workDescription}>
                确认分配
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}