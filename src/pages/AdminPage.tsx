import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

const roleOptions = [
  { value: 'admin', label: '管理员', description: '拥有系统所有权限' },
  { value: 'manager', label: '经理', description: '拥有项目和团队管理权限' },
  { value: 'user', label: '用户', description: '基础用户权限' }
];

export default function AdminPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");

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
              您没有访问管理页面的权限。只有管理员可以访问此页面。
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
      // 获取所有用户的基本信息
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, full_name, created_at');

      if (authError) throw authError;

      // 获取所有用户角色
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // 构建用户列表（暂时使用占位符邮箱）
      const usersWithRoles: UserWithRoles[] = [];
      
      for (const profile of authUsers || []) {
        // 获取这个用户的角色
        const roles = userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || [];
        
        usersWithRoles.push({
          id: profile.id,
          email: `user-${profile.id.slice(0, 8)}@example.com`, // 占位符
          full_name: profile.full_name,
          created_at: profile.created_at || new Date().toISOString(),
          roles
        });
      }

      setUsers(usersWithRoles);
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

  const assignRole = async () => {
    if (!assignEmail || !selectedRole) {
      toast({
        title: "错误",
        description: "请输入邮箱并选择角色",
        variant: "destructive",
      });
      return;
    }

    try {
      // 这里暂时简化处理，只分配管理员角色
      const { error } = await supabase.rpc('assign_admin_role', {
        _email: assignEmail
      });

      if (error) throw error;

      toast({
        title: "成功",
        description: `已为 ${assignEmail} 分配管理员角色`,
      });

      setAssignEmail("");
      setSelectedRole("");
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "错误",
        description: "分配角色失败",
        variant: "destructive",
      });
    }
  };

  const removeUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as 'admin' | 'manager' | 'user');

      if (error) throw error;

      toast({
        title: "成功",
        description: "角色已移除",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "错误",
        description: "移除角色失败",
        variant: "destructive",
      });
    }
  };

  const addUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: role as 'admin' | 'manager' | 'user'
        });

      if (error) throw error;

      toast({
        title: "成功",
        description: "角色已添加",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "错误",
        description: "添加角色失败",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-stat-red bg-stat-red/10';
      case 'manager': return 'text-stat-orange bg-stat-orange/10';
      case 'user': return 'text-stat-blue bg-stat-blue/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRoleText = (role: string) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.label || role;
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
              <Shield className="h-6 w-6" />
              系统管理
            </h1>
            <p className="text-muted-foreground">管理用户角色和权限</p>
          </div>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        
        {/* 角色分配 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              分配角色
            </CardTitle>
            <CardDescription>
              为用户分配角色和权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">用户邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={assignRole} className="w-full">
                  分配角色
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 角色说明 */}
        <Card>
          <CardHeader>
            <CardTitle>角色权限说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleOptions.map(role => (
                <div key={role.value} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getRoleColor(role.value)}>
                      {role.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              用户管理
            </CardTitle>
            <CardDescription>
              查看和管理所有用户的角色
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 搜索 */}
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户..."
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
                      <TableHead>用户</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          加载中...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
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
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <Badge key={role} className={getRoleColor(role)}>
                                  {getRoleText(role)}
                                </Badge>
                              ))}
                              {user.roles.length === 0 && (
                                <span className="text-muted-foreground text-sm">无角色</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('zh-CN')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select onValueChange={(role) => addUserRole(user.id, role)}>
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="添加" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roleOptions
                                    .filter(role => !user.roles.includes(role.value))
                                    .map(role => (
                                      <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                              
                              {user.roles.map((role) => (
                                <AlertDialog key={role}>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>确认移除角色</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        您确定要移除用户 {user.full_name || user.email} 的 "{getRoleText(role)}" 角色吗？
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>取消</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => removeUserRole(user.id, role)}>
                                        确认移除
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              ))}
                            </div>
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
      </div>
    </div>
  );
}