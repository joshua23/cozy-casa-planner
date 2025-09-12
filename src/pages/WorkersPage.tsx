import { HardHat, Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function WorkersPage() {
  const workers = [
    { 
      id: 1, 
      name: "李师傅", 
      specialty: "水电工", 
      experience: "8年", 
      phone: "138****1234", 
      currentProject: "海景别墅装修", 
      status: "工作中",
      rating: 4.8,
      completedProjects: 156
    },
    { 
      id: 2, 
      name: "张师傅", 
      specialty: "瓦工", 
      experience: "12年", 
      phone: "139****5678", 
      currentProject: "现代公寓改造", 
      status: "工作中",
      rating: 4.9,
      completedProjects: 203
    },
    { 
      id: 3, 
      name: "王师傅", 
      specialty: "木工", 
      experience: "15年", 
      phone: "137****9012", 
      currentProject: null, 
      status: "待分配",
      rating: 4.7,
      completedProjects: 289
    },
    { 
      id: 4, 
      name: "陈师傅", 
      specialty: "油漆工", 
      experience: "6年", 
      phone: "136****3456", 
      currentProject: "办公室装修", 
      status: "工作中",
      rating: 4.6,
      completedProjects: 98
    },
    { 
      id: 5, 
      name: "赵师傅", 
      specialty: "水电工", 
      experience: "10年", 
      phone: "135****7890", 
      currentProject: null, 
      status: "休假中",
      rating: 4.8,
      completedProjects: 187
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工作中": return "text-stat-blue bg-stat-blue/10";
      case "待分配": return "text-stat-green bg-stat-green/10";
      case "休假中": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "工作中": return <Clock className="w-4 h-4" />;
      case "待分配": return <CheckCircle className="w-4 h-4" />;
      case "休假中": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
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
            <HardHat className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">工人管理</h1>
              <p className="text-muted-foreground">管理施工队伍和工人档案信息</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索工人..." 
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>新增工人</span>
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
                <p className="text-sm text-muted-foreground">总工人数</p>
                <p className="text-2xl font-bold text-foreground">42</p>
              </div>
              <HardHat className="w-8 h-8 text-stat-blue" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">工作中</p>
                <p className="text-2xl font-bold text-foreground">28</p>
              </div>
              <Clock className="w-8 h-8 text-stat-green" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待分配</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <CheckCircle className="w-8 h-8 text-stat-orange" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均评分</p>
                <p className="text-2xl font-bold text-foreground">4.7</p>
              </div>
              <div className="w-8 h-8 bg-stat-yellow/10 rounded-lg flex items-center justify-center">
                <span className="text-stat-yellow text-lg">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">{worker.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(worker.status)}`}>
                        {getStatusIcon(worker.status)}
                        <span>{worker.status}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">专业：</span>{worker.specialty}
                      </div>
                      <div>
                        <span className="font-medium">经验：</span>{worker.experience}
                      </div>
                      <div>
                        <span className="font-medium">电话：</span>{worker.phone}
                      </div>
                      <div>
                        <span className="font-medium">完成项目：</span>{worker.completedProjects}个
                      </div>
                    </div>
                    {worker.currentProject && (
                      <div className="text-sm text-foreground">
                        <span className="font-medium text-muted-foreground">当前项目：</span>
                        {worker.currentProject}
                      </div>
                    )}
                    {renderStars(worker.rating)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    联系
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