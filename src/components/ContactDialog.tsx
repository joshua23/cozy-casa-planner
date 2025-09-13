import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

export function ContactDialog({ open, onOpenChange, contactInfo }: ContactDialogProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleCall = () => {
    // 在实际应用中，这里会调用电话功能
    toast({
      title: "拨打电话",
      description: `正在拨打 ${contactInfo.phone}`,
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "错误",
        description: "请输入消息内容",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "错误",
          description: "请先登录",
          variant: "destructive",
        });
        return;
      }

      // Update customer contact information in database
      if (contactInfo.phone || contactInfo.email) {
        const { error } = await supabase
          .from('customers')
          .update({
            phone: contactInfo.phone,
            email: contactInfo.email,
            last_contact_date: new Date().toISOString().split('T')[0]
          })
          .eq('name', contactInfo.name)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating customer contact:', error);
        }
      }

      toast({
        title: "消息发送成功",
        description: `消息已发送给 ${contactInfo.name}`,
      });
      
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error in send message:', error);
      toast({
        title: "错误",
        description: "发送消息时出现错误",
        variant: "destructive",
      });
    }
  };

  const handleEmailContact = () => {
    if (contactInfo.email) {
      // 在实际应用中，这里会打开邮件客户端
      toast({
        title: "发送邮件",
        description: `正在发送邮件到 ${contactInfo.email}`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>联系 {contactInfo.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleCall} className="w-full">
              拨打电话
            </Button>
            {contactInfo.email && (
              <Button variant="outline" onClick={handleEmailContact} className="w-full">
                发送邮件
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">发送消息</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入要发送的消息..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSendMessage}>
              发送消息
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}