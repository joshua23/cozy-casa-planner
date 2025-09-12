import { LucideIcon } from "lucide-react";

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

  return (
    <div className="bg-gradient-card rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-smooth border border-border/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">{title}</p>
              {subtitle && (
                <p className="text-muted-foreground/60 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
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
    </div>
  );
}