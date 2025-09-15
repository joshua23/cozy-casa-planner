import { FolderOpen, Plus, Search, Calendar, Users, CreditCard, Wrench, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { EditProjectDialog } from "@/components/EditProjectDialog";
import { ContactDialog } from "@/components/ContactDialog";
import { ProjectGanttChart } from "@/components/ProjectGanttChart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProjects, type Project as DBProject } from "@/hooks/useProjects";
import { useProjectPhases, ProjectPhase } from "@/hooks/useProjectPhases";
import { supabase } from "@/integrations/supabase/client";

interface PaymentNode {
  type: string;
  amount: number;
  paid: number;
  status: "未付" | "部分" | "已付";
}

interface ProjectPhase {
  name: string;
  status: "未开始" | "进行中" | "已完成";
  progress: number;
}

interface Project {
  id: number;
  name: string;
  status: string;
  client: string;
  deadline: string;
  contractAmount: number;
  paymentNodes: PaymentNode[];
  phases: ProjectPhase[];
  propertyType: string;
  decorationStyle: string;
  area: number;
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<DBProject | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, loading, error } = useProjects();
  
  // 为每个项目获取阶段数据
  const [projectPhases, setProjectPhases] = useState<Record<string, ProjectPhase[]>>({});
  const [phasesLoading, setPhasesLoading] = useState<Record<string, boolean>>({});

  // 获取所有项目的阶段数据
  useEffect(() => {
    const fetchAllPhases = async () => {
      for (const project of projects) {
        if (!projectPhases[project.id] && !phasesLoading[project.id]) {
          setPhasesLoading(prev => ({ ...prev, [project.id]: true }));
          
          try {
            const { data, error } = await supabase
              .from('project_phases')
              .select('*')
              .eq('project_id', project.id)
              .order('phase_order', { ascending: true });

            if (error) throw error;
            
            setProjectPhases(prev => ({ ...prev, [project.id]: data || [] }));
          } catch (err) {
            console.error('Error fetching phases for project', project.id, err);
          } finally {
            setPhasesLoading(prev => ({ ...prev, [project.id]: false }));
          }
        }
      }
    };

    if (projects.length > 0) {
      fetchAllPhases();
    }
  }, [projects]);

  // 示例数据，用于演示UI结构
  const sampleProjects: Project[] = [
    { 
      id: 1, 
      name: "海景别墅装修", 
      status: "进行中", 
      client: "张先生", 
      deadline: "2024-02-15",
      contractAmount: 1200000,
      propertyType: "别墅",
      decorationStyle: "现代简约",
      area: 300,
      paymentNodes: [
        { type: "合同总价", amount: 1200000, paid: 1200000, status: "已付" },
        { type: "定金", amount: 240000, paid: 240000, status: "已付" },
        { type: "一期工程款", amount: 360000, paid: 360000, status: "已付" },
        { type: "二期工程款", amount: 360000, paid: 180000, status: "部分" },
        { type: "三期工程款", amount: 120000, paid: 0, status: "未付" },
        { type: "尾款", amount: 120000, paid: 0, status: "未付" },
      ],
      phases: [
        { name: "拆除阶段", status: "已完成", progress: 100 },
        { name: "水电阶段", status: "已完成", progress: 100 },
        { name: "泥工阶段", status: "进行中", progress: 75 },
        { name: "木工阶段", status: "未开始", progress: 0 },
        { name: "油漆阶段", status: "未开始", progress: 0 },
        { name: "保洁阶段", status: "未开始", progress: 0 },
        { name: "收尾阶段", status: "未开始", progress: 0 },
      ]
    },
    { 
      id: 2, 
      name: "现代公寓改造", 
      status: "设计中", 
      client: "李女士", 
      deadline: "2024-03-01",
      contractAmount: 450000,
      propertyType: "平层",
      decorationStyle: "北欧风",
      area: 120,
      paymentNodes: [
        { type: "合同总价", amount: 450000, paid: 450000, status: "已付" },
        { type: "定金", amount: 90000, paid: 90000, status: "已付" },
        { type: "一期工程款", amount: 135000, paid: 0, status: "未付" },
        { type: "二期工程款", amount: 135000, paid: 0, status: "未付" },
        { type: "三期工程款", amount: 45000, paid: 0, status: "未付" },
        { type: "尾款", amount: 45000, paid: 0, status: "未付" },
      ],
      phases: [
        { name: "拆除阶段", status: "未开始", progress: 0 },
        { name: "水电阶段", status: "未开始", progress: 0 },
        { name: "泥工阶段", status: "未开始", progress: 0 },
        { name: "木工阶段", status: "未开始", progress: 0 },
        { name: "油漆阶段", status: "未开始", progress: 0 },
        { name: "保洁阶段", status: "未开始", progress: 0 },
        { name: "收尾阶段", status: "未开始", progress: 0 },
      ]
    },
  ];

  // 转换数据库项目为显示格式
  const displayProjects = projects.map(project => ({
    id: project.id,
    name: project.name,
    status: project.status,
    client: project.client_name,
    deadline: project.end_date || "未设定",
    contractAmount: project.total_contract_amount || 0,
    propertyType: project.property_type || "未知",
    decorationStyle: project.decoration_style || "未设定",
    area: project.area || 0,
    paymentNodes: [
      { type: "合同总价", amount: project.total_contract_amount || 0, paid: 0, status: "未付" as const },
    ],
    phases: [
      { name: "拆除阶段", status: "未开始" as const, progress: 0 },
      { name: "水电阶段", status: "未开始" as const, progress: 0 },
      { name: "泥工阶段", status: "未开始" as const, progress: 0 },
      { name: "木工阶段", status: "未开始" as const, progress: 0 },
      { name: "油漆阶段", status: "未开始" as const, progress: 0 },
      { name: "保洁阶段", status: "未开始" as const, progress: 0 },
      { name: "收尾阶段", status: "未开始" as const, progress: 0 },
    ]
  }));

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载项目数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载项目数据失败：{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "进行中": return "text-stat-blue bg-stat-blue/10";
      case "设计中": return "text-stat-orange bg-stat-orange/10";
      case "待开工": return "text-stat-red bg-stat-red/10";
      case "已完成": return "text-stat-green bg-stat-green/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "已付": return "text-stat-green bg-stat-green/10";
      case "部分": return "text-stat-orange bg-stat-orange/10";
      case "未付": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case "已完成": return <CheckCircle className="w-4 h-4 text-stat-green" />;
      case "进行中": return <Clock className="w-4 h-4 text-stat-orange" />;
      case "未开始": return <XCircle className="w-4 h-4 text-muted-foreground" />;
      case "暂停": return <XCircle className="w-4 h-4 text-stat-red" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">项目管理</h1>
              <p className="text-muted-foreground">管理所有装修项目的进度和状态</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索项目..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddProjectDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedProject ? (
          // 项目详情视图
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setSelectedProject(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回项目列表</span>
              </Button>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-foreground">{selectedProject.name}</h2>
                <Badge className={getStatusColor(selectedProject.status)}>
                  {selectedProject.status}
                </Badge>
              </div>
            </div>

            {/* 项目基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>项目基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">客户姓名</p>
                    <p className="font-medium text-foreground">{selectedProject.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">户型结构</p>
                    <p className="font-medium text-foreground">{selectedProject.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">装修风格</p>
                    <p className="font-medium text-foreground">{selectedProject.decoration_style}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">面积</p>
                    <p className="font-medium text-foreground">{selectedProject.area}㎡</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">合同总价</p>
                    <p className="font-medium text-foreground">¥{selectedProject.total_contract_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">项目地址</p>
                    <p className="font-medium text-foreground">{selectedProject.project_address || "未设定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">开始日期</p>
                    <p className="font-medium text-foreground">{selectedProject.start_date || "未设定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">截止日期</p>
                    <p className="font-medium text-foreground">{selectedProject.end_date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 付款节点 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>付款节点</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">暂无付款节点数据</p>
                </CardContent>
              </Card>

              {/* 项目进度节点 */}
              <ProjectGanttChart projectId={selectedProject.id} />
            </div>
          </div>
        ) : (
          // 项目列表视图
          <div className="grid gap-6">
            {displayProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">还没有项目，点击上方按钮创建第一个项目</p>
                <AddProjectDialog />
              </div>
            ) : (
              displayProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.status.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((project) => (
              <div key={project.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>客户：{project.client}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>截止：{project.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>户型：{project.propertyType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>合同：¥{(project.contractAmount / 10000).toFixed(0)}万</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${projectPhases[project.id]?.filter(p => p.status === '已完成').length / (projectPhases[project.id]?.length || 1) * 100 || 0}%` }}
                      ></div>
                    </div>

                    {/* 项目阶段详情 */}
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                        <span>项目阶段进度</span>
                        {phasesLoading[project.id] && (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        )}
                      </h4>
                      
                      {projectPhases[project.id] && projectPhases[project.id].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {projectPhases[project.id].slice(0, 6).map((phase) => (
                            <div key={phase.id} className="bg-muted/30 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getPhaseStatusIcon(phase.status)}
                                  <span className="text-sm font-medium text-foreground">{phase.phase_name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{Math.round(phase.progress || 0)}%</span>
                              </div>
                              <div className="w-full bg-background rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${phase.progress || 0}%` }}
                                ></div>
                              </div>
                              {phase.start_date && phase.end_date && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {phase.start_date} ~ {phase.end_date}
                                </div>
                              )}
                            </div>
                          ))}
                          {projectPhases[project.id].length > 6 && (
                            <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">
                                还有 {projectPhases[project.id].length - 6} 个阶段...
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 text-center">
                          {phasesLoading[project.id] ? "加载阶段数据中..." : "暂无阶段数据"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const dbProject = projects.find(p => p.id === project.id.toString());
                        if (dbProject) setSelectedProject(dbProject);
                      }}
                    >
                      查看详情
                    </Button>
                    <EditProjectDialog project={{
                      id: project.id.toString(), // 确保传递string类型的ID
                      name: project.name,
                      status: project.status,
                      client: project.client,
                      deadline: project.deadline,
                      contractAmount: project.contractAmount,
                      propertyType: project.propertyType,
                      decorationStyle: project.decorationStyle,
                      area: project.area
                    }}>
                      <Button size="sm">
                        编辑
                      </Button>
                    </EditProjectDialog>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contactInfo={contactInfo}
      />
    </div>
  );
}