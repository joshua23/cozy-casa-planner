import { Users, Plus, Search, Star, Phone, Briefcase, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { WorkerAssignDialog } from "@/components/WorkerAssignDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AddWorkerDialog } from "@/components/AddWorkerDialog";
import { useWorkers } from "@/hooks/useWorkers";
import { supabase } from "@/integrations/supabase/client";

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { workers, loading: workersLoading, error: workersError } = useWorkers();

  // 工人分配项目数据
  const [workerAssignments, setWorkerAssignments] = useState<Record<string, any[]>>({});
  const [assignmentsLoading, setAssignmentsLoading] = useState<Record<string, boolean>>({});

  // 获取工人的分配项目
  const fetchWorkerAssignments = async (workerId: string) => {
    if (assignmentsLoading[workerId]) return;

    try {
      setAssignmentsLoading(prev => ({ ...prev, [workerId]: true }));
      const { data, error } = await supabase
        .from('worker_assignments')
        .select(`
          *,
          projects (
            id,
            name,
            status,
            client_name,
            end_date
          )
        `)
        .eq('worker_id', workerId)
        .eq('status', '分配中');

      if (error) throw error;

      setWorkerAssignments(prev => ({ ...prev, [workerId]: data || [] }));
    } catch (err) {
      console.error('获取工人分配项目失败:', err);
    } finally {
      setAssignmentsLoading(prev => ({ ...prev, [workerId]: false }));
    }
  };

  // 获取所有工人的分配项目
  useEffect(() => {
    workers.forEach(worker => {
      if (!workerAssignments[worker.id] && !assignmentsLoading[worker.id]) {
        fetchWorkerAssignments(worker.id);
      }
    });
  }, [workers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "空闲": return "text-stat-green bg-stat-green/10";
      case "休假": return "text-stat-orange bg-stat-orange/10";
      case "离职": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 md:w-4 md:h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">工人管理</h1>
              <p className="text-sm md:text-base text-muted-foreground">管理零工信息和工作安排</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索工人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddWorkerDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {workersLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : workersError ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">加载失败: {workersError}</div>
          </div>
        ) : workers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground mb-4">还没有工人，点击上方按钮添加第一个工人</p>
              <AddWorkerDialog />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {workers.filter(worker =>
              worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.worker_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.phone?.includes(searchTerm) ||
              worker.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.specialties?.some((specialty: string) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((worker) => (
            <Card key={worker.id} className="hover:shadow-elevated transition-all duration-smooth">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm md:text-base flex-shrink-0">
                        {worker.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-foreground truncate">{worker.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="truncate">{worker.worker_type}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1 sm:mt-0">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="truncate">{worker.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-1">技能评价</p>
                        {renderStars(worker.skill_rating || 0)}
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-1">日薪</p>
                        <p className="font-medium text-foreground text-sm md:text-base">￥{worker.daily_rate || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-1">专长</p>
                        <div className="flex flex-wrap gap-1">
                          {(worker.specialties || []).slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {(worker.specialties || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(worker.specialties || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-1">状态</p>
                        <Badge className={`${getStatusColor(worker.status)} text-xs`}>
                          {worker.status}
                        </Badge>
                      </div>
                    </div>

                    {/* 分配项目显示 */}
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <FolderOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium text-foreground">分配项目</span>
                        {assignmentsLoading[worker.id] && (
                          <div className="w-3 h-3 animate-spin rounded-full border border-primary border-t-transparent"></div>
                        )}
                      </div>

                      {workerAssignments[worker.id] && workerAssignments[worker.id].length > 0 ? (
                        <div className="space-y-2">
                          {workerAssignments[worker.id].map((assignment) => (
                            <div key={assignment.id} className="bg-muted/30 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium text-foreground truncate">
                                  {assignment.projects?.name || '未知项目'}
                                </h5>
                                <Badge className={getStatusColor(assignment.projects?.status || 'unknown')} variant="outline">
                                  {assignment.projects?.status || '未知'}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>客户: {assignment.projects?.client_name || '未知'}</p>
                                <p>工作: {assignment.work_description}</p>
                                {assignment.estimated_amount && (
                                  <p>预估: ¥{assignment.estimated_amount.toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 text-center">
                          {assignmentsLoading[worker.id] ? '加载中...' : '暂无分配项目'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-center gap-2 lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setContactInfo({
                          name: worker.name,
                          phone: worker.phone
                        });
                        setContactDialogOpen(true);
                      }}
                    >
                      联系
                    </Button>
                    <WorkerAssignDialog
                      worker={{
                        id: parseInt(worker.id) || 0,
                        name: worker.name,
                        type: worker.worker_type,
                        hourlyRate: worker.hourly_rate || 0,
                        dailyRate: worker.daily_rate || 0,
                        specialties: worker.specialties || [],
                        status: worker.status
                      }}
                      onAssignmentCreated={() => fetchWorkerAssignments(worker.id)}
                    >
                      <Button size="sm" className="text-xs">
                        分配项目
                      </Button>
                    </WorkerAssignDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
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