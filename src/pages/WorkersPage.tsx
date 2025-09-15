import { Users, Plus, Search, Star, Phone, Briefcase, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { WorkerAssignDialog } from "@/components/WorkerAssignDialog";
import { TeamAssignDialog } from "@/components/TeamAssignDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AddWorkerDialog } from "@/components/AddWorkerDialog";
import { AddTeamDialog } from "@/components/AddTeamDialog";
import { useWorkers, type Worker as DBWorker } from "@/hooks/useWorkers";

interface Worker {
  id: number;
  name: string;
  workerType: string;
  phone: string;
  skillRating: number;
  hourlyRate?: number;
  dailyRate?: number;
  status: "空闲" | "工作中" | "休假" | "离职";
  specialties: string[];
  currentProject?: string;
  estimatedAmount?: number;
  paidAmount?: number;
  unpaidAmount?: number;
}

export default function WorkersPage() {
  const [selectedType, setSelectedType] = useState<"零工" | "施工队">("零工");
  const [searchTerm, setSearchTerm] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { workers, loading, error } = useWorkers();

  const workers: Worker[] = [
    {
      id: 1,
      name: "李师傅",
      workerType: "拆除工",
      phone: "138****1234",
      skillRating: 5,
      dailyRate: 300,
      status: "工作中",
      specialties: ["拆除", "清理"],
      currentProject: "海景别墅装修",
      estimatedAmount: 3000,
      paidAmount: 1500,
      unpaidAmount: 1500,
    },
    {
      id: 2,
      name: "王电工",
      workerType: "水电工",
      phone: "139****5678",
      skillRating: 4,
      dailyRate: 350,
      status: "空闲",
      specialties: ["水电安装", "线路维修"],
    },
    {
      id: 3,
      name: "张木工",
      workerType: "木工",
      phone: "137****9012",
      skillRating: 5,
      dailyRate: 400,
      status: "工作中",
      specialties: ["家具制作", "装修木工"],
      currentProject: "现代公寓改造",
      estimatedAmount: 8000,
      paidAmount: 4000,
      unpaidAmount: 4000,
    },
  ];

  const teams = [
    {
      id: 1,
      teamName: "精装施工队",
      teamLeader: "刘工长",
      teamLeaderPhone: "138****1111",
      teamSize: 8,
      specialties: ["水电", "泥工", "木工", "油漆"],
      efficiencyRating: 5,
      pricingModel: "包工包料",
      status: "工作中",
      currentProject: "海景别墅装修",
      contractAmount: 180000,
      paidAmount: 90000,
    },
    {
      id: 2,
      teamName: "快装施工队",
      teamLeader: "陈工长",
      teamLeaderPhone: "139****2222",
      teamSize: 6,
      specialties: ["水电", "泥工"],
      efficiencyRating: 4,
      pricingModel: "包工",
      status: "空闲",
    },
  ];

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
              <p className="text-muted-foreground">管理零工和施工队信息</p>
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
            {selectedType === "零工" ? <AddWorkerDialog /> : <AddTeamDialog />}
          </div>
        </div>
      </div>

      {/* Type Selector */}
      <div className="p-6 border-b border-border">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedType("零工")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedType === "零工"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            零工管理
          </button>
          <button
            onClick={() => setSelectedType("施工队")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedType === "施工队"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            施工队管理
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedType === "零工" ? (
          // 零工管理
          <div className="grid gap-6">
            {workers.filter(worker => 
              worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.workerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.phone.includes(searchTerm) ||
              worker.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
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
                              <span>{worker.workerType}</span>
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
                          {renderStars(worker.skillRating)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">日薪</p>
                          <p className="font-medium text-foreground">¥{worker.dailyRate || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">专长</p>
                          <div className="flex flex-wrap gap-1">
                            {worker.specialties.map((specialty, index) => (
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

                      {worker.currentProject && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">当前项目: {worker.currentProject}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">估价金额</p>
                              <p className="font-medium text-foreground">¥{worker.estimatedAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">已付金额</p>
                              <p className="font-medium text-stat-green">¥{worker.paidAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">未付金额</p>
                              <p className="font-medium text-stat-orange">¥{worker.unpaidAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
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
                        ...worker,
                        type: worker.workerType,
                        specialties: worker.specialties || [],
                        hourlyRate: worker.hourlyRate || 0,
                        dailyRate: worker.dailyRate || 0
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
        ) : (
          // 施工队管理
          <div className="grid gap-6">
            {teams.filter(team => 
              team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.teamLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.teamLeaderPhone.includes(searchTerm) ||
              team.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((team) => (
              <Card key={team.id} className="hover:shadow-elevated transition-all duration-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          队
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{team.teamName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>工长: {team.teamLeader}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{team.teamLeaderPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">团队人数</p>
                          <p className="font-medium text-foreground">{team.teamSize}人</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">效率评价</p>
                          {renderStars(team.efficiencyRating)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">定价模式</p>
                          <Badge variant="secondary">{team.pricingModel}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">状态</p>
                          <Badge className={getStatusColor(team.status)}>
                            {team.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">专业领域</p>
                        <div className="flex flex-wrap gap-2">
                          {team.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {team.currentProject && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">当前项目: {team.currentProject}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">合同金额</p>
                              <p className="font-medium text-foreground">¥{team.contractAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">已付金额</p>
                              <p className="font-medium text-stat-green">¥{team.paidAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setContactInfo({
                            name: team.teamLeader,
                            phone: team.teamLeaderPhone,
                            email: ""
                          });
                          setContactDialogOpen(true);
                        }}
                      >
                        联系工长
                      </Button>
                      <TeamAssignDialog team={{
                        ...team,
                        name: team.teamName,
                        leader: team.teamLeader,
                        members: team.teamSize,
                        currentProjects: 0,
                        completedProjects: 0,
                        efficiency: team.efficiencyRating,
                        rating: 4.5
                      }}>
                        <Button size="sm">
                          分配项目
                        </Button>
                      </TeamAssignDialog>
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