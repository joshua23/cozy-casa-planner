import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import CustomersPage from "./pages/CustomersPage";
import MaterialsPage from "./pages/MaterialsPage";
import WorkersPage from "./pages/WorkersPage";
import TeamsPage from "./pages/TeamsPage";
import TalentsPage from "./pages/TalentsPage";
import FinancePage from "./pages/FinancePage";
import AIPage from "./pages/AIPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="workers" element={<WorkersPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="talents" element={<TalentsPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="ai" element={<AIPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
