import { Users, Plus, Search, Star, Mail, Phone, Calendar, Briefcase } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AddTalentDialog } from "@/components/AddTalentDialog";
import { useTalents } from "@/hooks/useTalents";

export default function TalentsPage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { talents, loading, error } = useTalents();

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载人才数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载人才数据失败：{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "在职": return "text-stat-green bg-stat-green/10";
      case "离职": return "text-muted-foreground bg-muted";
      case "潜在": return "text-stat-blue bg-stat-blue/10";
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

  const getStatusStats = () => {
    const stats = talents.reduce((acc, talent) => {
      acc[talent.status] = (acc[talent.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: "在职设计师", count: stats["在职"] || 0, color: "text-stat-green" },
      { label: "离职设计师", count: stats["离职"] || 0, color: "text-muted-foreground" },
      { label: "潜在人才", count: stats["潜在"] || 0, color: "text-stat-blue" },
    ];
  };

  const filteredTalents = talents.filter(talent => 
    talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (talent.phone && talent.phone.includes(searchTerm)) ||
    (talent.email && talent.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    talent.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (talent.specialties && talent.specialties.some((specialty: string) => specialty.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">人才库</h1>
              <p className="text-sm md:text-base text-muted-foreground">管理在职、离职和潜在设计师人才</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索人才..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddTalentDialog />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {getStatusStats().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                  </div>
                  <Users className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Talents List */}
        <div className="grid gap-6">
          {filteredTalents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {talents.length === 0 ? "还没有人才记录，点击上方按钮添加第一个人才" : "没有找到匹配的人才"}
              </p>
              {talents.length === 0 && <AddTalentDialog />}
            </div>
          ) : (
            filteredTalents.map((talent) => (
            <Card key={talent.id} className="hover:shadow-elevated transition-all duration-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {talent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{talent.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{talent.role}</span>
                          </div>
                          {talent.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{talent.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">状态</p>
                        <Badge className={getStatusColor(talent.status)}>
                          {talent.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">技能评级</p>
                        {renderStars(talent.skill_rating || 0)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">工作经验</p>
                        <p className="font-medium text-foreground">{talent.experience_years || 0}年</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">最后联系</p>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm text-foreground">{talent.last_contact_date || "未联系"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">专业领域</p>
                      <div className="flex flex-wrap gap-2">
                        {(talent.specialties || []).map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {talent.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-1">备注</p>
                        <p className="text-sm text-foreground">{talent.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContactInfo({
                          name: talent.name,
                          phone: talent.phone || ""
                        });
                        setContactDialogOpen(true);
                      }}
                    >
                      联系
                    </Button>
                    {talent.status === "潜在" && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "邀请面试",
                            description: `已向 ${talent.name} 发送面试邀请`,
                          });
                        }}
                      >
                        邀请面试
                      </Button>
                    )}
                    {talent.status === "离职" && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "重新邀请",
                            description: `已向 ${talent.name} 发送重新合作邀请`,
                          });
                        }}
                      >
                        重新邀请
                      </Button>
                    )}
                    {talent.status === "在职" && (
                      <Button 
                        size="sm"
                        onClick={() => navigate('/projects')}
                      >
                        查看项目
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
      
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contactInfo={contactInfo}
      />
    </div>
  );
}