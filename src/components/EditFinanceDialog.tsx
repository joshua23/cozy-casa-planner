import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import type { FinancialRecord } from "@/hooks/useFinancialRecords";

interface FinanceFormData {
  transactionType: string;
  amount: string;
  category: string;
  projectId: string;
  transactionDate: string;
  paymentMethod: string;
  invoiceNumber: string;
  description: string;
}

interface EditFinanceDialogProps {
  transaction: FinancialRecord;
  children: React.ReactNode;
}

interface LegacyTransaction {
  id: string;
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

export function EditFinanceDialog({ transaction, children }: EditFinanceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { updateRecord, projects } = useFinancialRecords();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FinanceFormData>({
    transactionType: transaction.transaction_type || "",
    amount: (transaction.amount || 0).toString(),
    category: transaction.category,
    projectId: transaction.project_id || "none",
    transactionDate: transaction.transaction_date,
    paymentMethod: transaction.payment_method || "银行转账",
    invoiceNumber: transaction.invoice_number || "",
    description: transaction.description || "",
  });

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

    setLoading(true);
    try {
      const updateData = {
        transaction_type: formData.transactionType,
        amount: parseFloat(formData.amount),
        category: formData.category,
        project_id: formData.projectId === "none" ? null : formData.projectId,
        transaction_date: formData.transactionDate,
        payment_method: formData.paymentMethod,
        invoice_number: formData.invoiceNumber,
        description: formData.description,
      };

      await updateRecord(transaction.id, updateData);

      toast({
        title: "成功",
        description: "财务记录已更新",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating financial record:', error);
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "更新财务记录失败，请重试",
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
            <Label htmlFor="projectId">关联项目</Label>
            <Select value={formData.projectId} onValueChange={(value) => handleInputChange("projectId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择关联项目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无关联项目</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.client_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 显示选中项目的详细信息 */}
          {formData.projectId && formData.projectId !== "none" && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm font-medium text-foreground">关联项目信息</p>
              {(() => {
                const selectedProject = projects.find(p => p.id === formData.projectId);
                return selectedProject ? (
                  <>
                    <p className="text-sm text-muted-foreground">项目：{selectedProject.name}</p>
                    <p className="text-sm text-muted-foreground">客户：{selectedProject.client_name}</p>
                    <p className="text-sm text-muted-foreground">合同金额：¥{selectedProject.total_contract_amount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">合同金额：￥{selectedProject.total_contract_amount?.toLocaleString()}</p>
                  </>
                ) : null;
              })()}
            </div>
          )}

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
            <Button type="submit" disabled={loading}>
              {loading ? "更新中..." : "更新记录"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}