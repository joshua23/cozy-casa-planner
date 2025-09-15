import { UsersIcon, Plus, Search, Users, Crown, Award } from "lucide-react";
import { useState } from "react";
import { AddTeamDialog } from "@/components/AddTeamDialog";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { TeamAssignDialog } from "@/components/TeamAssignDialog";
import { TeamDetailDialog } from "@/components/TeamDetailDialog";
import { useTeams } from "@/hooks/useTeams";

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { teams, loading, error } = useTeams();

  if (loading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载团队数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">加载团队数据失败：{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "空闲": return "text-stat-green bg-stat-green/10";
      case "休假": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 4) return "text-stat-green bg-stat-green/10";
    if (efficiency >= 3) return "text-stat-blue bg-stat-blue/10";
    if (efficiency >= 2) return "text-stat-orange bg-stat-orange/10";
    return "text-stat-red bg-stat-red/10";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xs md:text-sm ${star <= rating ? 'text-stat-yellow' : 'text-muted-foreground'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs md:text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  // Calculate statistics from real data
  const totalTeams = teams.length;
  const totalMembers = teams.reduce((sum, team) => sum + (team.team_size || 0), 0);
  const avgEfficiency = teams.length > 0 
    ? Math.round(teams.reduce((sum, team) => sum + (team.efficiency_rating || 0), 0) / teams.length)
    : 0;
  const workingTeams = teams.filter(team => team.status === '工作中').length;

  const filteredTeams = teams.filter(team => 
    team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.specialties && team.specialties.some((specialty: string) => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">团队管理</h1>
              <p className="text-sm md:text-base text-muted-foreground">管理施工团队和项目分配</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索团队..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <AddTeamDialog />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">总团队数</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{totalTeams}</p>
              </div>
              <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-stat-blue flex-shrink-0" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">团队成员</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{totalMembers}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-stat-green flex-shrink-0" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">工作中团队</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{workingTeams}</p>
              </div>
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-stat-orange flex-shrink-0" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">平均效率</p>
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{avgEfficiency}星</p>
              </div>
              <Award className="w-6 h-6 md:w-8 md:h-8 text-stat-purple flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-4 md:gap-6">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                {teams.length === 0 ? "还没有团队，点击上方按钮创建第一个团队" : "没有找到匹配的团队"}
              </p>
              {teams.length === 0 && <AddTeamDialog />}
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div key={team.id} className="bg-card rounded-lg p-4 md:p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm md:text-base flex-shrink-0">
                        {team.team_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-foreground truncate">{team.team_name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">队长：{team.team_leader}</p>
                      </div>
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)} flex-shrink-0`}>
                        {team.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                      <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs md:text-sm text-muted-foreground">团队成员</p>
                        <p className="text-sm md:text-lg font-semibold text-foreground">{team.team_size || 0}人</p>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs md:text-sm text-muted-foreground">计价模式</p>
                        <p className="text-sm md:text-lg font-semibold text-foreground truncate">{team.pricing_model || "未设定"}</p>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs md:text-sm text-muted-foreground">效率评级</p>
                        <span className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${getEfficiencyColor(team.efficiency_rating || 0)}`}>
                          {team.efficiency_rating || 0}星
                        </span>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs md:text-sm text-muted-foreground">联系电话</p>
                        <p className="text-sm md:text-lg font-semibold text-foreground truncate">{team.team_leader_phone || "未设定"}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm text-muted-foreground">专业领域</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {(team.specialties || []).length > 0 ? (
                              <>
                                {team.specialties.slice(0, 2).map((specialty: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded truncate">
                                    {specialty}
                                  </span>
                                ))}
                                {team.specialties.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{team.specialties.length - 2}</span>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">暂无专业领域</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground">团队评分</p>
                          <div className="mt-1">
                            {renderStars(team.efficiency_rating || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-4">
                    <TeamMemberDialog team={{
                      id: parseInt(team.id) || 0,
                      name: team.team_name,
                      leader: team.team_leader,
                      members: team.team_size || 0,
                      currentProjects: 0,
                      completedProjects: 0,
                      specialties: team.specialties || [],
                      efficiency: team.efficiency_rating || 0,
                      status: team.status,
                      rating: team.efficiency_rating || 0
                    }}>
                      <button className="px-2 md:px-3 py-1 text-xs md:text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                        成员管理
                      </button>
                    </TeamMemberDialog>
                    <TeamAssignDialog team={{
                      id: parseInt(team.id) || 0,
                      name: team.team_name,
                      leader: team.team_leader,
                      members: team.team_size || 0,
                      currentProjects: 0,
                      completedProjects: 0,
                      specialties: team.specialties || [],
                      efficiency: team.efficiency_rating || 0,
                      status: team.status,
                      rating: team.efficiency_rating || 0
                    }}>
                      <button className="px-2 md:px-3 py-1 text-xs md:text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                        分配项目
                      </button>
                    </TeamAssignDialog>
                    <TeamDetailDialog team={{
                      id: parseInt(team.id) || 0,
                      name: team.team_name,
                      leader: team.team_leader,
                      members: team.team_size || 0,
                      currentProjects: 0,
                      completedProjects: 0,
                      specialties: team.specialties || [],
                      efficiency: team.efficiency_rating || 0,
                      status: team.status,
                      rating: team.efficiency_rating || 0
                    }}>
                      <button className="px-2 md:px-3 py-1 text-xs md:text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        详情
                      </button>
                    </TeamDetailDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}