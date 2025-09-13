import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FinanceFormData {
  transactionType: string;
  amount: string;
  category: string;
  projectId: string;
  description: string;
  transactionDate: string;
  paymentMethod: string;
  invoiceNumber: string;
}

export function AddFinanceDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FinanceFormData>({
    transactionType: "",
    amount: "",
    category: "",
    projectId: "",
    description: "",
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMethod: "",
    invoiceNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.transactionType || !formData.amount || !formData.category) {
      toast({
        title: "错误",
        description: "请填写交易类型、金额和分类",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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

      const { error } = await supabase
        .from('financial_records')
        .insert({
          transaction_type: formData.transactionType,
          amount: parseFloat(formData.amount),
          category: formData.category,
          project_id: formData.projectId || null,
          description: formData.description,
          transaction_date: formData.transactionDate,
          payment_method: formData.paymentMethod,
          invoice_number: formData.invoiceNumber,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "成功",
        description: "财务记录添加成功！",
      });

      setFormData({
        transactionType: "",
        amount: "",
        category: "",
        projectId: "",
        description: "",
        transactionDate: new Date().toISOString().split('T')[0],
        paymentMethod: "",
        invoiceNumber: "",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding financial record:', error);
      toast({
        title: "错误",
        description: "添加财务记录失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FinanceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新增记录</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增财务记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">交易类型 *</Label>
              <Select value={formData.transactionType} onValueChange={(value) => handleInputChange("transactionType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择交易类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="收入">收入</SelectItem>
                  <SelectItem value="支出">支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">金额 *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="请输入金额"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="项目款">项目款</SelectItem>
                  <SelectItem value="设计费">设计费</SelectItem>
                  <SelectItem value="材料采购">材料采购</SelectItem>
                  <SelectItem value="人工费">人工费</SelectItem>
                  <SelectItem value="设备租赁">设备租赁</SelectItem>
                  <SelectItem value="办公费用">办公费用</SelectItem>
                  <SelectItem value="营销费用">营销费用</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDate">交易日期</Label>
              <Input
                id="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleInputChange("transactionDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">支付方式</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择支付方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="现金">现金</SelectItem>
                  <SelectItem value="银行转账">银行转账</SelectItem>
                  <SelectItem value="支付宝">支付宝</SelectItem>
                  <SelectItem value="微信支付">微信支付</SelectItem>
                  <SelectItem value="支票">支票</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">发票号码</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                placeholder="请输入发票号码"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">备注说明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="请输入备注说明"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "添加中..." : "添加记录"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}