import { useEffect, useState } from "react";
import { Bell, User, FolderOpen, Package, TrendingUp } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { useProjects } from "@/hooks/useProjects";
import { useMaterials } from "@/hooks/useMaterials";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";

interface NewsItem {
  id: string;
  type: 'customer' | 'project' | 'material' | 'finance';
  title: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

export function NewsTickerBanner() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const { customers } = useCustomers();
  const { projects } = useProjects();
  const { materials } = useMaterials();
  const { records } = useFinancialRecords();

  useEffect(() => {
    const allItems: NewsItem[] = [];

    // 添加最新客户记录
    customers.slice(0, 3).forEach(customer => {
      allItems.push({
        id: `customer-${customer.id}`,
        type: 'customer',
        title: `新增客户：${customer.name}`,
        time: new Date(customer.created_at).toLocaleString(),
        icon: User,
        color: 'text-stat-blue'
      });
    });

    // 添加最新项目记录
    projects.slice(0, 3).forEach(project => {
      allItems.push({
        id: `project-${project.id}`,
        type: 'project',
        title: `新建项目：${project.name}`,
        time: new Date(project.created_at).toLocaleString(),
        icon: FolderOpen,
        color: 'text-stat-green'
      });
    });

    // 添加最新材料记录
    materials.slice(0, 2).forEach(material => {
      allItems.push({
        id: `material-${material.id}`,
        type: 'material',
        title: `新增材料：${material.name}`,
        time: new Date(material.created_at).toLocaleString(),
        icon: Package,
        color: 'text-stat-orange'
      });
    });

    // 添加最新财务记录
    records.slice(0, 2).forEach(record => {
      allItems.push({
        id: `finance-${record.id}`,
        type: 'finance',
        title: `${record.transaction_type}：¥${record.amount?.toLocaleString()}`,
        time: new Date(record.created_at).toLocaleString(),
        icon: TrendingUp,
        color: 'text-stat-purple'
      });
    });

    // 按时间排序，最新的在前
    allItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNewsItems(allItems.slice(0, 8)); // 只显示最新的8条
  }, [customers, projects, materials, records]);

  if (newsItems.length === 0) {
    return (
      <div className="bg-gradient-primary text-primary-foreground p-3 mb-6 rounded-lg border border-border/20">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5" />
          <span className="text-sm font-medium">暂无最新动态</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-primary text-primary-foreground p-3 mb-6 rounded-lg border border-border/20 overflow-hidden">
      <div className="flex items-center space-x-3">
        <Bell className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee flex space-x-8 whitespace-nowrap">
            {newsItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 flex-shrink-0">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs opacity-80">({item.time})</span>
              </div>
            ))}
            {/* 重复显示以实现无缝滚动 */}
            {newsItems.map((item) => (
              <div key={`${item.id}-repeat`} className="flex items-center space-x-2 flex-shrink-0">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs opacity-80">({item.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}