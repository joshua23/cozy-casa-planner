import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { ResetPasswordDialog } from "@/components/ResetPasswordDialog";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  AlertTriangle,
  Key,
  Mail,
  Calendar,
  MoreVertical,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export default function UserManagementPage() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    open: boolean;
    email: string;
    userId: string;
  }>({ open: false, email: "", userId: "" });

  // 权限检查
  if (!hasRole('admin')) {
    return (
      <div className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              访问被拒绝
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              您没有访问用户管理页面的权限。只有管理员可以访问此页面。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 获取所有用户的 profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // 获取 auth.users 数据（需要管理员权限）
      // 注意：这需要通过 Edge Function 或后端 API 来获取
      // 这里暂时使用 profiles 数据
      const userList: User[] = profiles?.map(profile => ({
        id: profile.id,
        email: profile.email || `user-${profile.id.slice(0, 8)}@example.com`,
        full_name: profile.full_name,
        created_at: profile.created_at,
        last_sign_in_at: profile.updated_at,
        email_confirmed_at: profile.created_at,
      })) || [];

      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "错误",
        description: "获取用户列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "成功",
        description: `密码重置邮件已发送至 ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "发送失败",
        description: error.message || "无法发送重置邮件",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" />
              用户管理
            </h1>
            <p className="text-muted-foreground">管理系统用户账号和密码</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreateUserDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              创建用户
            </Button>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>
              查看和管理所有用户账号
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 搜索 */}
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户邮箱或姓名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {/* 用户表格 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户信息</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            加载中...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          没有找到用户
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {user.full_name || "未设置姓名"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-sm">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.email_confirmed_at ? (
                              <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                已验证
                              </Badge>
                            ) : (
                              <Badge variant="secondary">未验证</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(user.created_at).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at ? (
                              <span className="text-sm">
                                {new Date(user.last_sign_in_at).toLocaleDateString('zh-CN')}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">从未登录</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>用户操作</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setResetPasswordDialog({
                                    open: true,
                                    email: user.email,
                                    userId: user.id
                                  })}
                                >
                                  <Key className="h-4 w-4 mr-2" />
                                  重置密码
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSendPasswordReset(user.email)}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  发送重置邮件
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">系统注册用户</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">已验证用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.email_confirmed_at).length}
              </div>
              <p className="text-xs text-muted-foreground">邮箱已验证</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.last_sign_in_at).length}
              </div>
              <p className="text-xs text-muted-foreground">至少登录过一次</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
        onSuccess={fetchUsers}
      />

      {resetPasswordDialog.open && (
        <ResetPasswordDialog
          open={resetPasswordDialog.open}
          onOpenChange={(open) => setResetPasswordDialog({ ...resetPasswordDialog, open })}
          userEmail={resetPasswordDialog.email}
          userId={resetPasswordDialog.userId}
        />
      )}
    </div>
  );
}