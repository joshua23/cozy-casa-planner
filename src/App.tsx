import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import CustomersPage from "./pages/CustomersPage";
import MaterialsPage from "./pages/MaterialsPage";
import SuppliersPage from "./pages/SuppliersPage";
import WorkersPage from "./pages/WorkersPage";
import TeamsPage from "./pages/TeamsPage";
import TalentsPage from "./pages/TalentsPage";
import FinancePage from "./pages/FinancePage";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存5分钟
      staleTime: 5 * 60 * 1000,
      // 缓存保留10分钟
      gcTime: 10 * 60 * 1000,
      // 重试配置
      retry: (failureCount, error) => {
        // 认证错误不重试
        if (error?.message?.includes('未登录') || error?.message?.includes('身份验证')) {
          return false;
        }
        // 其他错误重试2次
        return failureCount < 2;
      },
      // 网络重连时重新获取
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // 变更失败重试1次
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 公开路由 */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* 受保护的路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="workers" element={<WorkersPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="talents" element={<TalentsPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="ai" element={<AIPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
