import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
        <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
      </div>
    );
  }

  const themes = [
    { name: "light", icon: Sun, label: "浅色" },
    { name: "dark", icon: Moon, label: "深色" },
    { name: "system", icon: Monitor, label: "系统" },
  ];

  const currentTheme = themes.find(t => t.name === theme) || themes[0];

  return (
    <div className="relative group">
      <button
        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-smooth"
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.name === theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          setTheme(nextTheme.name);
        }}
      >
        <currentTheme.icon className="w-5 h-5 text-sidebar-text" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded-md text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        切换到{themes[(themes.findIndex(t => t.name === theme) + 1) % themes.length].label}主题
      </div>
    </div>
  );
}