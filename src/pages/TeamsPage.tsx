import { UsersIcon, Plus, Search, Users, Crown, Award, Star } from "lucide-react";
import { useState } from "react";
import { AddTeamDialog } from "@/components/AddTeamDialog";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { TeamAssignDialog } from "@/components/TeamAssignDialog";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";
import { useTeams } from "@/hooks/useTeams";
import { Badge } from "@/components/ui/badge";

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { teams, loading, error } = useTeams();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "空闲": return "text-stat-green bg-stat-green/10";
      case "休假": return "text-stat-orange bg-stat-orange/10";
      case "待分配": return "text-stat-purple bg-stat-purple/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-stat-green bg-stat-green/10";
    if (efficiency >= 90) return "text-stat-blue bg-stat-blue/10";
    if (efficiency >= 85) return "text-stat-orange bg-stat-orange/10";
    return "text-stat-red bg-stat-red/10";
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
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UsersIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">团队管理</h1>
              <p className="text-muted-foreground">管理施工团队和项目分配</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索团队..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddTeamDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">加载失败: {error}</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">总团队数</p>
                    <p className="text-2xl font-bold text-foreground">{teams.length}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-stat-blue" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">团队成员</p>
                    <p className="text-2xl font-bold text-foreground">{teams.reduce((sum, team) => sum + (team.team_size || 0), 0)}</p>
                  </div>
                  <Users className="w-8 h-8 text-stat-green" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">工作中团队</p>
                    <p className="text-2xl font-bold text-foreground">{teams.filter(team => team.status === '工作中').length}</p>
                  </div>
                  <Crown className="w-8 h-8 text-stat-orange" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">平均效率</p>
                    <p className="text-2xl font-bold text-foreground">{teams.length > 0 ? Math.round(teams.reduce((sum, team) => sum + (team.efficiency_rating || 0), 0) / teams.length) : 0}⭐</p>
                  </div>
                  <Award className="w-8 h-8 text-stat-purple" />
                </div>
              </div>
            </div>

            {/* Teams Grid */}
            {teams.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">暂无团队数据</div>
              </div>
            ) : (
              <div className="grid gap-6">
                {teams.filter(team =>
                  team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  team.team_leader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  team.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  team.specialties?.some((specialty: string) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((team) => (
            <div key={team.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                      {team.team_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{team.team_name}</h3>
                      <p className="text-sm text-muted-foreground">队长：{team.team_leader}</p>
                      {team.team_leader_phone && (
                        <p className="text-xs text-muted-foreground">电话：{team.team_leader_phone}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">团队成员</p>
                      <p className="text-lg font-semibold text-foreground">{team.team_size || 0}人</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">计价模式</p>
                      <p className="text-lg font-semibold text-foreground">{team.pricing_model || "未设置"}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">效率评级</p>
                      <div className="flex justify-center">
                        {renderStars(team.efficiency_rating || 0)}
                      </div>
                    </div>
                  </div>

                  {team.specialties && team.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">专业领域</p>
                      <div className="flex items-center space-x-2 flex-wrap">
                        {team.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <TeamMemberDialog team={team}>
                    <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                      成员管理
                    </button>
                  </TeamMemberDialog>
                  <TeamAssignDialog team={team}>
                    <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                      分配项目
                    </button>
                  </TeamAssignDialog>
                  <TeamDetailDialog team={team}>
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      详情
                    </button>
                  </TeamDetailDialog>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}