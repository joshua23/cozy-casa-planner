import { UserCheck, Plus, Search, Star, MapPin, Phone, Mail } from "lucide-react";

export default function TalentsPage() {
  const talents = [
    { 
      id: 1, 
      name: "刘设计师", 
      specialty: "室内设计", 
      experience: "10年", 
      education: "清华美院", 
      phone: "138****1111", 
      email: "liu@design.com",
      location: "北京市朝阳区", 
      status: "可入职",
      portfolio: 28,
      awards: 5,
      expectedSalary: "15-20K",
      rating: 4.9,
      skills: ["3D建模", "软装搭配", "空间规划"]
    },
    { 
      id: 2, 
      name: "孙工程师", 
      specialty: "结构工程", 
      experience: "15年", 
      education: "同济大学", 
      phone: "139****2222", 
      email: "sun@engineer.com",
      location: "上海市浦东区", 
      status: "在谈中",
      portfolio: 45,
      awards: 8,
      expectedSalary: "20-25K",
      rating: 4.8,
      skills: ["结构设计", "施工管理", "质量控制"]
    },
    { 
      id: 3, 
      name: "周监理", 
      specialty: "工程监理", 
      experience: "12年", 
      education: "建筑工程学院", 
      phone: "137****3333", 
      email: "zhou@monitor.com",
      location: "广州市天河区", 
      status: "可入职",
      portfolio: 78,
      awards: 3,
      expectedSalary: "12-18K",
      rating: 4.7,
      skills: ["质量监控", "进度管理", "安全监督"]
    },
    { 
      id: 4, 
      name: "马师傅", 
      specialty: "高级木工", 
      experience: "20年", 
      education: "职业技术学院", 
      phone: "136****4444", 
      email: "ma@wood.com",
      location: "深圳市南山区", 
      status: "已入职",
      portfolio: 156,
      awards: 12,
      expectedSalary: "8-12K",
      rating: 4.9,
      skills: ["精细木工", "家具制作", "工艺雕刻"]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "可入职": return "text-stat-green bg-stat-green/10";
      case "在谈中": return "text-stat-orange bg-stat-orange/10";
      case "已入职": return "text-stat-blue bg-stat-blue/10";
      case "暂不考虑": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
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
            <UserCheck className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">人才库</h1>
              <p className="text-muted-foreground">管理优秀人才档案和招聘信息</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索人才..." 
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>添加人才</span>
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
                <p className="text-sm text-muted-foreground">人才总数</p>
                <p className="text-2xl font-bold text-foreground">128</p>
              </div>
              <UserCheck className="w-8 h-8 text-stat-blue" />
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">可入职</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
              <div className="w-8 h-8 bg-stat-green/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-stat-green" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">在谈中</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="w-8 h-8 bg-stat-orange/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-stat-orange" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均评分</p>
                <p className="text-2xl font-bold text-foreground">4.7</p>
              </div>
              <Star className="w-8 h-8 text-stat-yellow" />
            </div>
          </div>
        </div>

        {/* Talents Grid */}
        <div className="grid gap-6">
          {talents.map((talent) => (
            <div key={talent.id} className="bg-card rounded-lg p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-smooth">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {talent.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">{talent.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(talent.status)}`}>
                        {talent.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-stat-yellow" />
                        <span className="text-sm text-muted-foreground">{talent.awards}个奖项</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">专业：</span>
                        <span className="text-foreground">{talent.specialty}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">经验：</span>
                        <span className="text-foreground">{talent.experience}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">学历：</span>
                        <span className="text-foreground">{talent.education}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{talent.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{talent.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{talent.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">作品集：</span>
                          <span className="text-sm text-foreground">{talent.portfolio}件</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">期望薪资：</span>
                          <span className="text-sm text-foreground">{talent.expectedSalary}</span>
                        </div>
                        <div>
                          {renderStars(talent.rating)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">技能标签：</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {talent.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    查看简历
                  </button>
                  <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    联系沟通
                  </button>
                  <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    邀请面试
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