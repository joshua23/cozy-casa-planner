import { FolderOpen, Plus, Search, Calendar, Users, CreditCard, Wrench, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { ContactDialog } from "@/components/ContactDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const projects: Project[] = [
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
                  {selectedProject.paymentNodes.map((node, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{node.type}</p>
                        <p className="text-sm text-muted-foreground">
                          已付: ¥{node.paid.toLocaleString()} / ¥{node.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getPaymentStatusColor(node.status)}>
                        {node.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 项目进度节点 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5" />
                    <span>项目进度节点</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProject.phases.map((phase, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getPhaseStatusIcon(phase.status)}
                          <span className="font-medium text-foreground">{phase.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                    <p className="font-medium text-foreground">{selectedProject.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">户型结构</p>
                    <p className="font-medium text-foreground">{selectedProject.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">装修风格</p>
                    <p className="font-medium text-foreground">{selectedProject.decorationStyle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">面积</p>
                    <p className="font-medium text-foreground">{selectedProject.area}㎡</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">合同总价</p>
                    <p className="font-medium text-foreground">¥{selectedProject.contractAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">截止日期</p>
                    <p className="font-medium text-foreground">{selectedProject.deadline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // 项目列表视图
          <div className="grid gap-6">
            {projects.map((project) => (
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
                        style={{ width: `${project.phases.filter(p => p.status === '已完成').length / project.phases.length * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      查看详情
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "编辑项目",
                          description: `正在编辑项目 ${project.name}`,
                        });
                      }}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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