import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FinanceFormData {
  transactionType: string;
  amount: string;
  category: string;
  project: string;
  transactionDate: string;
  paymentMethod: string;
  invoiceNumber: string;
  description: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  category: string;
  project: string;
  date: string;
  status: string;
  description: string;
  customerName?: string;
  projectClientName?: string;
}

interface EditFinanceDialogProps {
  transaction: Transaction;
  children: React.ReactNode;
}

export function EditFinanceDialog({ transaction, children }: EditFinanceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FinanceFormData>({
    transactionType: transaction.type,
    amount: transaction.amount.toString(),
    category: transaction.category,
    project: transaction.project || "",
    transactionDate: transaction.date,
    paymentMethod: "银行转账",
    invoiceNumber: "",
    description: transaction.description,
  });

  // 显示关联的客户信息
  const displayCustomerInfo = transaction.customerName || transaction.projectClientName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.transactionType || !formData.amount || !formData.category) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would update the financial record in Supabase
      toast({
        title: "成功",
        description: "财务记录已更新",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "更新财务记录失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof FinanceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑财务记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="amount">金额 (元) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="请输入金额"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="项目收款">项目收款</SelectItem>
                  <SelectItem value="材料采购">材料采购</SelectItem>
                  <SelectItem value="人工费用">人工费用</SelectItem>
                  <SelectItem value="设备租赁">设备租赁</SelectItem>
                  <SelectItem value="运营费用">运营费用</SelectItem>
                  <SelectItem value="其他收入">其他收入</SelectItem>
                  <SelectItem value="其他支出">其他支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">关联项目</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => handleInputChange("project", e.target.value)}
                placeholder="关联项目"
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* 显示客户信息 */}
          {displayCustomerInfo && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium text-foreground">关联客户信息</p>
              <p className="text-sm text-muted-foreground">客户：{displayCustomerInfo}</p>
              {transaction.project && (
                <p className="text-sm text-muted-foreground">项目：{transaction.project}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">关联项目</Label>
              <Select value={formData.project} onValueChange={(value) => handleInputChange("project", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="海景别墅装修">海景别墅装修</SelectItem>
                  <SelectItem value="现代公寓改造">现代公寓改造</SelectItem>
                  <SelectItem value="办公室装修">办公室装修</SelectItem>
                  <SelectItem value="商铺装修">商铺装修</SelectItem>
                  <SelectItem value="无关联项目">无关联项目</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionDate">交易日期 *</Label>
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
                  <SelectItem value="支票">支票</SelectItem>
                  <SelectItem value="信用卡">信用卡</SelectItem>
                  <SelectItem value="微信支付">微信支付</SelectItem>
                  <SelectItem value="支付宝">支付宝</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="请输入交易描述"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              更新记录
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}