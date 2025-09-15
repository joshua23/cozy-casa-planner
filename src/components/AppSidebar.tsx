import { 
  BarChart3, 
  FolderOpen, 
  Users, 
  Package, 
  Store,
  HardHat, 
  Users as UsersIcon, 
  UserCheck, 
  Calculator,
  Bot,
  Building2,
  Shield
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

const menuItems = [
  { title: "数据统计", url: "/", icon: BarChart3 },
  { title: "项目管理", url: "/projects", icon: FolderOpen },
  { title: "客户管理", url: "/customers", icon: Users },
  { title: "材料管理", url: "/materials", icon: Package },
  { title: "供应商管理", url: "/suppliers", icon: Store },
  { title: "工人管理", url: "/workers", icon: HardHat },
  { title: "团队管理", url: "/teams", icon: UsersIcon },
  { title: "人才库", url: "/talents", icon: UserCheck },
  { title: "财务管理", url: "/finance", icon: Calculator },
  { title: "AI自动管理", url: "/ai", icon: Bot },
];

const adminItems = [
  { title: "系统管理", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { hasRole } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="h-full flex flex-col">
      <Sidebar 
        className={collapsed ? "w-14" : "w-64"} 
        collapsible="icon"
      >
        <SidebarHeader className="p-4 md:p-6 border-b border-sidebar-text/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img
                  src={logo}
                  alt="YDYSBDD Logo"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              {!collapsed && (
                <div className="text-sidebar-text">
                  <h1 className="text-base md:text-lg font-bold">云顶艺墅</h1>
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
                        className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 rounded-lg"
                      >
                        <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm md:text-base truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* 管理员菜单 - 只对管理员显示 */}
          {hasRole('admin') && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-text/80 font-medium">
                管理设置
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
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
                          className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 rounded-lg"
                        >
                          <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          {!collapsed && <span className="text-sm md:text-base truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        
        {/* Footer */}
        <SidebarFooter className="border-t border-border/50">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              {collapsed && <ThemeToggle />}
              <UserMenu />
            </div>
          </div>
        </SidebarFooter>

        {/* Bottom Brand - only show when not collapsed */}
        {!collapsed && (
          <div className="absolute bottom-16 left-6 right-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 mx-auto mb-2">
                <img 
                  src={logo} 
                  alt="YDYSBDD Logo" 
                  className="w-full h-full object-contain rounded-sm"
                />
              </div>
              <p className="text-sidebar-text/90 text-sm font-medium">云顶艺墅管理</p>
              <p className="text-sidebar-text/60 text-xs">专业 · 高效 · 智能</p>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}