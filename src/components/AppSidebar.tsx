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
  Building2
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  { title: "数据统计", url: "/", icon: BarChart3 },
  { title: "项目管理", url: "/projects", icon: FolderOpen },
  { title: "客户管理", url: "/customers", icon: Users },
  { title: "材料管理", url: "/materials", icon: Package },
  { title: "工人管理", url: "/workers", icon: HardHat },
  { title: "团队管理", url: "/teams", icon: UsersIcon },
  { title: "人才库", url: "/talents", icon: UserCheck },
  { title: "财务管理", url: "/finance", icon: Calculator },
  { title: "AI自动管理", url: "/ai", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      className={collapsed ? "w-14" : "w-64"} 
      collapsible="icon"
    >
      <SidebarHeader className="p-6 border-b border-sidebar-text/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-sidebar-text" />
            </div>
            {!collapsed && (
              <div className="text-sidebar-text">
                <h1 className="text-lg font-bold">云端艺家</h1>
                <p className="text-xs text-sidebar-text/70">装修管理系统</p>
              </div>
            )}
          </div>
          {!collapsed && <ThemeToggle />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-text/80 font-medium">
            系统功能
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`
                      transition-all duration-smooth
                      ${isActive(item.url) 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm' 
                        : 'text-sidebar-text/90 hover:bg-sidebar-accent hover:text-sidebar-text'
                      }
                    `}
                  >
                    <NavLink 
                      to={item.url} 
                      end
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Brand - only show when not collapsed */}
      {!collapsed && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Building2 className="w-8 h-8 text-sidebar-text mx-auto mb-2" />
            <p className="text-sidebar-text/90 text-sm font-medium">云端装修管理</p>
            <p className="text-sidebar-text/60 text-xs">专业 · 高效 · 智能</p>
          </div>
        </div>
      )}
    </Sidebar>
  );
}