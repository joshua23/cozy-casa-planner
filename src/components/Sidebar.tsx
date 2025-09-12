import { 
  BarChart3, 
  FolderOpen, 
  Users, 
  Package, 
  HardHat, 
  UsersIcon, 
  UserCheck, 
  Calculator,
  Bot,
  Building2,
  Home
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  { icon: BarChart3, label: "数据统计", active: true },
  { icon: FolderOpen, label: "项目管理" },
  { icon: Users, label: "客户管理" },
  { icon: Package, label: "材料管理" },
  { icon: HardHat, label: "工人管理" },
  { icon: UsersIcon, label: "团队管理" },
  { icon: UserCheck, label: "人才库" },
  { icon: Calculator, label: "财务管理" },
  { icon: Bot, label: "AI自动管理" },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gradient-sidebar shadow-elevated">
      {/* Logo Area */}
      <div className="p-6 border-b border-sidebar-text/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-sidebar-text" />
            </div>
            <div className="text-sidebar-text">
              <h1 className="text-lg font-bold">云端艺家</h1>
              <p className="text-xs text-sidebar-text/70">装修管理系统</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-300 ease-smooth
                  ${item.active 
                    ? 'bg-white/20 text-sidebar-text shadow-glow' 
                    : 'text-sidebar-text/80 hover:bg-white/10 hover:text-sidebar-text'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Brand */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Building2 className="w-8 h-8 text-sidebar-text mx-auto mb-2" />
          <p className="text-sidebar-text/90 text-sm font-medium">云端装修管理</p>
          <p className="text-sidebar-text/60 text-xs">专业 · 高效 · 智能</p>
        </div>
      </div>
    </div>
  );
}