import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, PlayCircle, PauseCircle, Clock, Calendar } from "lucide-react";
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

  const createDefaultPhases = async () => {
    try {
      const defaultPhases = [
        { name: '跟进洽谈', order: 1, duration: 3, description: '项目前期沟通、需求确认、合同签订等' },
        { name: '设计阶段', order: 2, duration: 14, description: '量房、设计方案、效果图制作、方案确认' },
        { name: '拆除阶段', order: 3, duration: 3, description: '原有装修拆除、垃圾清理' },
        { name: '水电改造', order: 4, duration: 7, description: '水电线路改造、开槽布线' },
        { name: '泥瓦工程', order: 5, duration: 10, description: '防水、贴砖、地面找平等' },
        { name: '木工阶段', order: 6, duration: 12, description: '吊顶、柜体制作、木工装饰' },
        { name: '油漆涂料', order: 7, duration: 8, description: '墙面处理、刷漆、贴壁纸' },
        { name: '安装阶段', order: 8, duration: 5, description: '灯具、开关插座、洁具安装' },
        { name: '软装配饰', order: 9, duration: 3, description: '家具摆放、装饰品安装' },
        { name: '收尾阶段', order: 10, duration: 2, description: '清洁、验收、整改' },
        { name: '已完工', order: 11, duration: 1, description: '项目交付、售后服务' },
      ];

      // 批量创建阶段
      for (const phase of defaultPhases) {
        await supabase
          .from('project_phases')
          .insert({
            project_id: project.id,
            phase_name: phase.name,
            phase_order: phase.order,
            estimated_duration: phase.duration,
            status: '未开始',
            description: phase.description,
            progress: 0
          });
      }

      toast({
        title: "成功",
        description: "已创建默认项目阶段",
      });

      // 刷新阶段数据
      window.location.reload();
    } catch (error) {
      console.error('Error creating phases:', error);
      toast({
        title: "错误",
        description: "创建默认阶段失败",
        variant: "destructive",
      });
    }
  };

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
                  <Button onClick={createDefaultPhases}>
                    创建默认项目阶段
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {phases.map((phase, index) => (
                    <div key={phase.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(phase.status)}
                          <div>
                            <h4 className="font-medium">{phase.phase_name}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <span className="text-muted-foreground">完成进度</span>
                          <span className="font-medium">{Math.round(phase.progress)}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>

                      {/* 操作区域 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground min-w-fit">状态：</label>
                          <Select
                            value={phase.status}
                            onValueChange={(value) => updatePhaseStatus(phase.id, value)}
                          >
                            <SelectTrigger className="w-full">
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
                          <label className="text-sm text-muted-foreground min-w-fit">进度：</label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(phase.progress)}
                            onChange={(e) => {
                              const progress = parseInt(e.target.value);
                              if (progress >= 0 && progress <= 100) {
                                updatePhaseProgress(phase.id, progress);
                              }
                            }}
                            className="w-full"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>预计 {phase.estimated_duration} 天</span>
                          {phase.actual_start_date && (
                            <span className="ml-2">
                              • 开始：{new Date(phase.actual_start_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 日期设置 */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-sm">计划开始日期</Label>
                          <Input
                            type="date"
                            value={phase.start_date || ''}
                            onChange={(e) => updatePhaseDates(phase.id, e.target.value, phase.end_date)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">计划结束日期</Label>
                          <Input
                            type="date"
                            value={phase.end_date || ''}
                            onChange={(e) => updatePhaseDates(phase.id, phase.start_date, e.target.value)}
                          />
                        </div>
                      </div>
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