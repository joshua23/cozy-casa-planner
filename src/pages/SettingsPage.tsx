import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const { user, signOut, hasRole } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      projectUpdates: true,
      financeAlerts: true,
      systemNotifications: false
    },
    preferences: {
      language: "zh-CN",
      timezone: "Asia/Shanghai",
      dateFormat: "YYYY-MM-DD",
      currency: "CNY"
    },
    privacy: {
      profileVisibility: "private",
      activityLog: true,
      dataSharing: false
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // 这里可以添加保存设置到后端的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      
      toast({
        title: "成功",
        description: "设置已保存",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "保存设置失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    toast({
      title: "导出数据",
      description: "数据导出功能正在开发中",
    });
  };

  const deleteAccount = () => {
    toast({
      title: "删除账户",
      description: "账户删除功能需要联系管理员",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">设置</h1>
            <p className="text-muted-foreground">管理您的账户设置和偏好</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              外观设置
            </CardTitle>
            <CardDescription>
              自定义应用程序的外观和主题
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">主题模式</Label>
                <div className="text-sm text-muted-foreground">
                  切换明暗主题模式
                </div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知设置
            </CardTitle>
            <CardDescription>
              配置您希望接收的通知类型
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">邮件通知</Label>
                <div className="text-sm text-muted-foreground">
                  接收重要更新的邮件通知
                </div>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'email', checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">项目更新</Label>
                <div className="text-sm text-muted-foreground">
                  项目状态变更时通知
                </div>
              </div>
              <Switch
                checked={settings.notifications.projectUpdates}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'projectUpdates', checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">财务提醒</Label>
                <div className="text-sm text-muted-foreground">
                  重要财务事件提醒
                </div>
              </div>
              <Switch
                checked={settings.notifications.financeAlerts}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'financeAlerts', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              区域设置
            </CardTitle>
            <CardDescription>
              设置语言、时区和格式偏好
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">语言</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => 
                    handleSettingChange('preferences', 'language', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">时区</Label>
                <Select
                  value={settings.preferences.timezone}
                  onValueChange={(value) => 
                    handleSettingChange('preferences', 'timezone', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择时区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">北京时间 (UTC+8)</SelectItem>
                    <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">日期格式</Label>
                <Select
                  value={settings.preferences.dateFormat}
                  onValueChange={(value) => 
                    handleSettingChange('preferences', 'dateFormat', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择日期格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">2024-01-01</SelectItem>
                    <SelectItem value="DD/MM/YYYY">01/01/2024</SelectItem>
                    <SelectItem value="MM/DD/YYYY">01/01/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">货币</Label>
                <Select
                  value={settings.preferences.currency}
                  onValueChange={(value) => 
                    handleSettingChange('preferences', 'currency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择货币" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNY">人民币 (¥)</SelectItem>
                    <SelectItem value="USD">美元 ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              隐私设置
            </CardTitle>
            <CardDescription>
              管理您的隐私和数据设置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">活动日志</Label>
                <div className="text-sm text-muted-foreground">
                  记录您的系统活动
                </div>
              </div>
              <Switch
                checked={settings.privacy.activityLog}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'activityLog', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              数据管理
            </CardTitle>
            <CardDescription>
              导出或删除您的数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">导出数据</Label>
                <div className="text-sm text-muted-foreground">
                  下载您的所有数据
                </div>
              </div>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              危险操作
            </CardTitle>
            <CardDescription>
              这些操作无法撤销，请谨慎操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">删除账户</Label>
                <div className="text-sm text-muted-foreground">
                  永久删除您的账户和所有数据
                </div>
              </div>
              <Button variant="destructive" onClick={deleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除账户
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </div>
    </div>
  );
}