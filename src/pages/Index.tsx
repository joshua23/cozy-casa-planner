import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Global header with trigger */}
          <header className="h-12 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="YDYSBDD Logo" 
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-sm text-muted-foreground">装修管理系统</span>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;