import { DivideIcon as LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color,
  trend 
}: StatCardProps) {
  const colorClasses = {
    blue: "text-stat-blue bg-stat-blue/10",
    green: "text-stat-green bg-stat-green/10", 
    purple: "text-stat-purple bg-stat-purple/10",
    orange: "text-stat-orange bg-stat-orange/10",
    red: "text-stat-red bg-stat-red/10",
    yellow: "text-stat-yellow bg-stat-yellow/10",
  };

  const cardColorClass = colorClasses[color] || "";

  return (
    <div className="bg-gradient-card rounded-lg p-4 md:p-6 shadow-card hover:shadow-elevated transition-all duration-smooth border border-border/50">
      <div className="space-y-3">
        {/* 图标和标题行 */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${cardColorClass}`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-sm font-medium truncate">{title}</p>
            {subtitle && (
              <p className="text-muted-foreground/60 text-xs truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* 数值和趋势 */}
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-foreground break-words">{value}</h3>
          {trend && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${
                trend.isPositive ? 'text-stat-green' : 'text-stat-red'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </span>
              <span className="text-muted-foreground text-xs">较上期</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}