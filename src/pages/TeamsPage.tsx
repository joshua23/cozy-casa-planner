import { UsersIcon, Plus, Search, Users, Crown, Award } from "lucide-react";

export default function TeamsPage() {
  const teams = [
    { 
      id: 1, 
      name: "精装施工队", 
      leader: "李师傅", 
      members: 8, 
      currentProjects: 3, 
      completedProjects: 45, 
      specialties: ["水电", "瓦工", "木工"], 
      status: "工作中",
      efficiency: 96,
      rating: 4.8
    },
    { 
      id: 2, 
      name: "基础建设队", 
      leader: "张师傅", 
      members: 12, 
      currentProjects: 2, 
      completedProjects: 62, 
      specialties: ["基建", "水电", "防水"], 
      status: "工作中",
      efficiency: 94,
      rating: 4.7
    },
    { 
      id: 3, 
      name: "软装设计队", 
      leader: "王设计师", 
      members: 6, 
      currentProjects: 4, 
      completedProjects: 78, 
      specialties: ["设计", "软装", "搭配"], 
      status: "工作中",
      efficiency: 98,
      rating: 4.9
    },
    { 
      id: 4, 
      name: "维修服务队", 
      leader: "陈师傅", 
      members: 5, 
      currentProjects: 0, 
      completedProjects: 156, 
      specialties: ["维修", "保养", "应急"], 
      status: "待分配",
      efficiency: 92,
      rating: 4.6
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "待分配": return "text-stat-green bg-stat-green/10";
      case "休息中": return "text-muted-foreground bg-muted";
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
          <span 
            key={star} 
            className={`text-xs ${star <= rating ? 'text-stat-yellow' : 'text-muted-foreground'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
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
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>新建团队</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总团队数</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <UsersIcon className="w-8 h-8 text-stat-blue" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">团队成员</p>
                <p className="text-2xl font-bold text-foreground">42</p>
              </div>
              <Users className="w-8 h-8 text-stat-green" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行项目</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Crown className="w-8 h-8 text-stat-orange" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均效率</p>
                <p className="text-2xl font-bold text-foreground">95%</p>
              </div>
              <Award className="w-8 h-8 text-stat-purple" />
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">队长：{team.leader}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                      {team.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">团队成员</p>
                      <p className="text-lg font-semibold text-foreground">{team.members}人</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">进行项目</p>
                      <p className="text-lg font-semibold text-foreground">{team.currentProjects}个</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">完成项目</p>
                      <p className="text-lg font-semibold text-foreground">{team.completedProjects}个</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">工作效率</p>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getEfficiencyColor(team.efficiency)}`}>
                        {team.efficiency}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-muted-foreground">专业领域</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {team.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">团队评分</p>
                        <div className="mt-1">
                          {renderStars(team.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    成员管理
                  </button>
                  <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    分配项目
                  </button>
                  <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}