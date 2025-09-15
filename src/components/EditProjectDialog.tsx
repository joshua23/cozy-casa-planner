import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, PlayCircle, PauseCircle, Clock, Calendar, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjectPhases } from "@/hooks/useProjectPhases";
import { supabase } from "@/integrations/supabase/client";

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
  id: string; // 改为string类型以匹配数据库ID
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
  const [activeTab, setActiveTab] = useState("info");
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [phaseEditData, setPhaseEditData] = useState<{
    phase_name: string;
    description: string;
    estimated_duration: number;
    start_date: string;
    end_date: string;
  }>({
    phase_name: "",
    description: "",
    estimated_duration: 0,
    start_date: "",
    end_date: ""
  });
  const { toast } = useToast();
  const { phases, loading, updatePhaseStatus, updatePhaseProgress, updatePhaseDates } = useProjectPhases(project.id);
  
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "text-stat-green bg-stat-green/10";
      case "进行中": return "text-stat-blue bg-stat-blue/10";
      case "暂停": return "text-stat-orange bg-stat-orange/10";
      case "未开始": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已完成": return <CheckCircle className="w-4 h-4 text-stat-green" />;
      case "进行中": return <PlayCircle className="w-4 h-4 text-stat-blue" />;
      case "暂停": return <PauseCircle className="w-4 h-4 text-stat-orange" />;
      case "未开始": return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const startEditingPhase = (phase: any) => {
    setEditingPhase(phase.id);
    setPhaseEditData({
      phase_name: phase.phase_name,
      description: phase.description || "",
      estimated_duration: phase.estimated_duration || 7,
      start_date: phase.start_date || "",
      end_date: phase.end_date || ""
    });
  };

  const cancelEditingPhase = () => {
    setEditingPhase(null);
    setPhaseEditData({
      phase_name: "",
      description: "",
      estimated_duration: 0,
      start_date: "",
      end_date: ""
    });
  };

  const savePhaseEdit = async (phaseId: string) => {
    try {
      const { error } = await supabase
        .from('project_phases')
        .update({
          phase_name: phaseEditData.phase_name,
          description: phaseEditData.description,
          estimated_duration: phaseEditData.estimated_duration,
          start_date: phaseEditData.start_date || null,
          end_date: phaseEditData.end_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', phaseId);

      if (error) throw error;

      toast({
        title: "成功",
        description: "阶段信息已更新",
      });

      setEditingPhase(null);
      // Refresh phases data
      window.location.reload();
    } catch (error) {
      console.error('Error updating phase:', error);
      toast({
        title: "错误",
        description: "更新阶段信息失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑项目 - {project.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="phases">项目阶段</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="phases" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">项目阶段管理</h3>
                  <p className="text-sm text-muted-foreground">管理项目的各个阶段进度和状态</p>
                </div>
              </div>
              
              <Separator />
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">加载阶段数据...</span>
                </div>
              ) : phases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">该项目还没有设置阶段</div>
                  <div className="text-sm text-muted-foreground">请在项目详情页面的甘特图中查看和管理项目阶段</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {phases.map((phase, index) => (
                    <div key={phase.id} className="border rounded-lg p-4 space-y-3">
                      {editingPhase === phase.id ? (
                        // 编辑模式
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>阶段名称</Label>
                              <Input
                                value={phaseEditData.phase_name}
                                onChange={(e) => setPhaseEditData(prev => ({ ...prev, phase_name: e.target.value }))}
                                placeholder="请输入阶段名称"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>预计工期 (天)</Label>
                              <Input
                                type="number"
                                min="1"
                                value={phaseEditData.estimated_duration}
                                onChange={(e) => setPhaseEditData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || 1 }))}
                                placeholder="请输入预计工期"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>开始日期</Label>
                              <Input
                                type="date"
                                value={phaseEditData.start_date}
                                onChange={(e) => setPhaseEditData(prev => ({ ...prev, start_date: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>结束日期</Label>
                              <Input
                                type="date"
                                value={phaseEditData.end_date}
                                onChange={(e) => setPhaseEditData(prev => ({ ...prev, end_date: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>阶段描述</Label>
                            <Textarea
                              value={phaseEditData.description}
                              onChange={(e) => setPhaseEditData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="请输入阶段描述"
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => savePhaseEdit(phase.id)}>
                              <Save className="w-4 h-4 mr-1" />
                              保存
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditingPhase}>
                              <X className="w-4 h-4 mr-1" />
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // 查看模式
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(phase.status)}
                              <div>
                                <h4 className="font-medium">{phase.phase_name}</h4>
                                <p className="text-sm text-muted-foreground">{phase.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingPhase(phase)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                编辑
                              </Button>
                              <Badge className={getStatusColor(phase.status)}>
                                {phase.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(phase.progress)}%
                              </span>
                            </div>
                          </div>

                          {/* 进度条 */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">进度</span>
                              <span className="font-medium">{Math.round(phase.progress)}%</span>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                          </div>

                          {/* 阶段信息 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">预计工期</p>
                              <p className="font-medium">{phase.estimated_duration || 0} 天</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">开始日期</p>
                              <p className="font-medium">{phase.start_date || "未设定"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">结束日期</p>
                              <p className="font-medium">{phase.end_date || "未设定"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">实际开始</p>
                              <p className="font-medium">{phase.actual_start_date || "未开始"}</p>
                            </div>
                          </div>

                          {/* 操作区域 */}
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-muted-foreground">状态：</label>
                              <Select
                                value={phase.status}
                                onValueChange={(value) => handleStatusChange(phase.id, value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="未开始">未开始</SelectItem>
                                  <SelectItem value="进行中">进行中</SelectItem>
                                  <SelectItem value="已完成">已完成</SelectItem>
                                  <SelectItem value="暂停">暂停</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="text-sm text-muted-foreground">进度：</label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={Math.round(phase.progress)}
                                onChange={(e) => handleProgressChange(phase.id, e.target.value)}
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}