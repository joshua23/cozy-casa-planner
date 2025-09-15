import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogIn, UserPlus, Building2, KeyRound } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
}

interface ForgotPasswordFormData {
  email: string;
}
export default function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState<ForgotPasswordFormData>({
    email: "",
  });
  // 如果用户已登录，重定向到主页
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!forgotPasswordForm.email) {
      setError("请输入邮箱地址");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordForm.email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("密码重置邮件已发送，请检查您的邮箱");
        setForgotPasswordForm({ email: "" });
      }
    } catch (error) {
      setError("发送重置邮件失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!loginForm.email || !loginForm.password) {
      setError("请填写所有字段");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("邮箱或密码错误");
        } else {
          setError(error.message);
        }
      } else {
        // 登录成功，useEffect 会处理重定向
      }
    } catch (error) {
      setError("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!signupForm.email || !signupForm.password || !signupForm.fullName || !signupForm.username) {
      setError("请填写所有必填字段");
      setIsLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("密码确认不匹配");
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError("密码至少需要6个字符");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        signupForm.email,
        signupForm.password,
        signupForm.fullName,
        signupForm.username
      );
      
      if (error) {
        if (error.message === "User already registered") {
          setError("该邮箱已被注册");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("注册成功！正在为您登录...");
        setSignupForm({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          username: "",
        });
        
        // 注册成功后自动登录
        setTimeout(async () => {
          const { error: signInError } = await signIn(signupForm.email, signupForm.password);
          if (signInError) {
            setError("注册成功但自动登录失败，请手动登录");
            setActiveTab("signin");
          }
        }, 1000);
      }
    } catch (error) {
      setError("注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="YDYSBDD Logo" 
              className="w-16 h-16 rounded-lg object-cover bg-white p-2"
            />
          </div>
          <CardTitle className="text-2xl font-bold">装修管理系统</CardTitle>
          <CardDescription>
            欢迎使用 YDYSBDD 装修项目管理平台
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin" className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>注册</span>
              </TabsTrigger>
              <TabsTrigger value="forgot" className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4" />
                <span>忘记密码</span>
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">邮箱</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">密码</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="请输入密码"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-sm text-primary hover:underline"
                  >
                    忘记密码？
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">姓名 *</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="请输入真实姓名"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">用户名 *</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="请输入用户名"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">邮箱 *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">密码 *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="请输入密码（至少6个字符）"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">确认密码 *</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="请再次输入密码"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "注册中..." : "注册"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="forgot">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">邮箱地址</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="请输入注册时使用的邮箱"
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "发送中..." : "发送重置邮件"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-sm text-primary hover:underline"
                  >
                    返回登录
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}