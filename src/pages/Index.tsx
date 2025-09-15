import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Global header with trigger */}
          <header className="h-12 md:h-14 flex items-center border-b border-border bg-card px-3 md:px-6">
            <SidebarTrigger className="mr-2 md:mr-3" />
            <span className="text-sm md:text-base text-muted-foreground truncate">装修管理系统</span>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;