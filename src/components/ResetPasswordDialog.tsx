import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userId: string;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  userEmail,
  userId
}: ResetPasswordDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast({
        title: "错误",
        description: "请输入新密码",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "错误",
        description: "密码至少需要6个字符",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "错误",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 注意：在生产环境中，应该通过后端 API 或 Edge Function 来重置密码
      // 这里使用管理员 API 需要 service role key
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (error) throw error;

      toast({
        title: "成功",
        description: `用户 ${userEmail} 的密码已重置`,
      });

      setNewPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error resetting password:', error);

      // 如果没有管理员权限，提供替代方案
      if (error.message?.includes('admin')) {
        // 发送密码重置邮件作为替代方案
        try {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(userEmail, {
            redirectTo: `${window.location.origin}/auth`,
          });

          if (resetError) throw resetError;

          toast({
            title: "重置邮件已发送",
            description: `密码重置链接已发送至 ${userEmail}`,
          });

          onOpenChange(false);
        } catch (resetErr: any) {
          toast({
            title: "重置失败",
            description: resetErr.message || "无法重置密码",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "重置失败",
          description: error.message || "无法重置密码",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "邮件已发送",
        description: `密码重置链接已发送至 ${userEmail}`,
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "发送失败",
        description: error.message || "无法发送重置邮件",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            重置密码
          </DialogTitle>
          <DialogDescription>
            为用户 {userEmail} 重置密码
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="至少6个字符"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">或</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSendResetEmail}
              disabled={loading}
              className="w-full"
            >
              发送重置邮件到用户邮箱
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              重置密码
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}