import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AddMemberDialog } from "@/components/AddMemberDialog";
import { EditMemberDialog } from "@/components/EditMemberDialog";
import { User, Phone, Star, Edit, Trash2 } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  specialties: string[];
  rating: number;
  status: string;
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

interface TeamMemberDialogProps {
  team: Team;
  children: React.ReactNode;
}

export function TeamMemberDialog({ team, children }: TeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Mock team members data - in real app, this would come from Supabase
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: team.leader,
      role: "队长",
      phone: "138****1234",
      specialties: ["管理", "水电"],
      rating: 4.8,
      status: "工作中"
    },
    {
      id: 2,
      name: "张师傅",
      role: "瓦工",
      phone: "139****5678",
      specialties: ["瓦工", "防水"],
      rating: 4.6,
      status: "工作中"
    },
    {
      id: 3,
      name: "李师傅",
      role: "木工",
      phone: "137****9012",
      specialties: ["木工", "安装"],
      rating: 4.7,
      status: "待分配"
    },
    {
      id: 4,
      name: "王师傅",
      role: "水电工",
      phone: "136****3456",
      specialties: ["水电", "布线"],
      rating: 4.5,
      status: "工作中"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "待分配": return "text-stat-green bg-stat-green/10";
      case "休息中": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= rating ? 'text-stat-yellow fill-current' : 'text-muted-foreground'}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  const handleEditMember = (member: TeamMember) => {
    toast({
      title: "编辑成员",
      description: `正在编辑 ${member.name} 的信息`,
    });
  };

  const handleRemoveMember = (member: TeamMember) => {
    toast({
      title: "移除成员",
      description: `${member.name} 已从团队中移除`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{team.name} - 成员管理</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">总成员</p>
                <p className="text-lg font-semibold text-foreground">{team.members}人</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">在岗人员</p>
                <p className="text-lg font-semibold text-foreground">{teamMembers.filter(m => m.status === "工作中").length}人</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">待分配</p>
                <p className="text-lg font-semibold text-foreground">{teamMembers.filter(m => m.status === "待分配").length}人</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">团队评分</p>
                <p className="text-lg font-semibold text-foreground">{team.rating}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">团队成员列表</h4>
              <AddMemberDialog teamId={team.id}>
                <Button size="sm">
                  添加成员
                </Button>
              </AddMemberDialog>
            </div>
            
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{member.name}</h5>
                        <Badge variant="secondary">{member.role}</Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                        <div>
                          专业: {member.specialties.join(", ")}
                        </div>
                        <div>
                          {renderStars(member.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <EditMemberDialog member={member}>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        编辑
                      </Button>
                    </EditMemberDialog>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      移除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}