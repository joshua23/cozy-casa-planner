import { Users, Plus, Search, Star, Phone, Briefcase } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { WorkerAssignDialog } from "@/components/WorkerAssignDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AddWorkerDialog } from "@/components/AddWorkerDialog";
import { useWorkers } from "@/hooks/useWorkers";

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { workers, loading: workersLoading, error: workersError } = useWorkers();

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
            className={`w-4 h-4 ${
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
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">工人管理</h1>
              <p className="text-muted-foreground">管理零工信息和工作安排</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索工人..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddWorkerDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
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
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">还没有工人，点击上方按钮添加第一个工人</p>
              <AddWorkerDialog />
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {workers.filter(worker =>
              worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.worker_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.phone?.includes(searchTerm) ||
              worker.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.specialties?.some((specialty: string) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((worker) => (
            <Card key={worker.id} className="hover:shadow-elevated transition-all duration-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{worker.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{worker.worker_type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{worker.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">技能评价</p>
                        {renderStars(worker.skill_rating || 0)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">日薪</p>
                        <p className="font-medium text-foreground">￥{worker.daily_rate || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">专长</p>
                        <div className="flex flex-wrap gap-1">
                          {(worker.specialties || []).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">状态</p>
                        <Badge className={getStatusColor(worker.status)}>
                          {worker.status}
                        </Badge>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContactInfo({
                          name: worker.name,
                          phone: worker.phone,
                          email: ""
                        });
                        setContactDialogOpen(true);
                      }}
                    >
                      联系
                    </Button>
                    <WorkerAssignDialog worker={{
                      id: parseInt(worker.id) || 0,
                      name: worker.name,
                      type: worker.worker_type,
                      hourlyRate: worker.hourly_rate || 0,
                      dailyRate: worker.daily_rate || 0,
                      specialties: worker.specialties || [],
                      status: worker.status
                    }}>
                      <Button size="sm">
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