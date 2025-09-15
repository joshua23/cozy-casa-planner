import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Users, Award, TrendingUp, Calendar, Clock, Star } from "lucide-react";

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

interface TeamDetailDialogProps {
  team: Team;
  children: React.ReactNode;
}

export function TeamDetailDialog({ team, children }: TeamDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Mock team detail data - in real app, this would come from Supabase
  const teamDetails = {
    establishedDate: "2022-03-15",
    totalRevenue: 2850000,
    averageProjectDuration: 45,
    customerSatisfaction: 96,
    onTimeCompletion: 94,
    safetyRecord: 98,
    recentProjects: [
      { name: "海景别墅装修", status: "进行中", progress: 75, client: "张先生" },
      { name: "现代公寓改造", status: "进行中", progress: 60, client: "李女士" },
      { name: "商务办公室", status: "已完成", progress: 100, client: "王总" }
    ],
    monthlyPerformance: [
      { month: "1月", revenue: 380000, projects: 3, efficiency: 95 },
      { month: "2月", revenue: 420000, projects: 4, efficiency: 96 },
      { month: "3月", revenue: 456000, projects: 4, efficiency: 98 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "进行中": return "text-stat-blue bg-stat-blue/10";
      case "已完成": return "text-stat-green bg-stat-green/10";
      case "暂停": return "text-stat-orange bg-stat-orange/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'text-stat-yellow fill-current' : 'text-muted-foreground'}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>{team.name} - 详细信息</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 基础信息 */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">基础信息</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">队长</p>
                <p className="font-medium text-foreground">{team.leader}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成员数量</p>
                <p className="font-medium text-foreground">{team.members}人</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成立时间</p>
                <p className="font-medium text-foreground">{teamDetails.establishedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">团队评分</p>
                <div className="mt-1">
                  {renderStars(team.rating)}
                </div>
              </div>
            </div>
          </div>

          {/* 专业技能 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">专业技能</h4>
            <div className="flex flex-wrap gap-2">
              {team.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* 关键指标 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">关键指标</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-stat-green" />
                  <p className="text-sm text-muted-foreground">总营收</p>
                </div>
                <p className="text-xl font-bold text-foreground">￥{(teamDetails.totalRevenue / 10000).toFixed(0)}万</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-stat-blue" />
                  <p className="text-sm text-muted-foreground">平均工期</p>
                </div>
                <p className="text-xl font-bold text-foreground">{teamDetails.averageProjectDuration}天</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-stat-purple" />
                  <p className="text-sm text-muted-foreground">客户满意度</p>
                </div>
                <p className="text-xl font-bold text-foreground">{teamDetails.customerSatisfaction}%</p>
              </div>
            </div>
          </div>

          {/* 绩效指标 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">绩效指标</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">工作效率</span>
                  <span className="text-sm font-medium">{team.efficiency}%</span>
                </div>
                <Progress value={team.efficiency} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">按时完工率</span>
                  <span className="text-sm font-medium">{teamDetails.onTimeCompletion}%</span>
                </div>
                <Progress value={teamDetails.onTimeCompletion} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">安全记录</span>
                  <span className="text-sm font-medium">{teamDetails.safetyRecord}%</span>
                </div>
                <Progress value={teamDetails.safetyRecord} className="h-2" />
              </div>
            </div>
          </div>

          {/* 近期项目 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">近期项目</h4>
            <div className="space-y-3">
              {teamDetails.recentProjects.map((project, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium text-foreground">{project.name}</h5>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">客户: {project.client}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">进度</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 月度绩效 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">近三个月绩效</h4>
            <div className="space-y-3">
              {teamDetails.monthlyPerformance.map((month, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">月份</p>
                      <p className="font-medium text-foreground">{month.month}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">营收</p>
                      <p className="font-medium text-foreground">￥{(month.revenue / 10000).toFixed(0)}万</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">项目数</p>
                      <p className="font-medium text-foreground">{month.projects}个</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">效率</p>
                      <p className="font-medium text-foreground">{month.efficiency}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              toast({
                title: "导出报告",
                description: `${team.name} 的详细报告已导出`,
              });
            }}>
              导出报告
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}