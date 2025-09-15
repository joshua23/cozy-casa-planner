import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";

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
  const { createRecord, getProjectOptions, projects } = useFinancialRecords();

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
      const recordData = {
        transaction_type: formData.transactionType,
        amount: parseFloat(formData.amount),
        category: formData.category,
        project_id: formData.projectId === "none" ? null : formData.projectId || null,
        description: formData.description,
        transaction_date: formData.transactionDate,
        payment_method: formData.paymentMethod,
        invoice_number: formData.invoiceNumber,
      };

      await createRecord(recordData);

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
        description: error instanceof Error ? error.message : "添加财务记录失败，请重试",
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
                  <SelectItem value="定金">定金</SelectItem>
                  <SelectItem value="一期工程款">一期工程款</SelectItem>
                  <SelectItem value="二期工程款">二期工程款</SelectItem>
                  <SelectItem value="三期工程款">三期工程款</SelectItem>
                  <SelectItem value="尾款">尾款</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
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
                  {getProjectOptions().map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.label}
                    </SelectItem>
                  ))}
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
            <Label htmlFor="description">交易说明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="请输入详细的交易说明，如：中冶别墅沈先生的设计费"
              rows={3}
            />
          </div>

          {/* 显示关联项目预览 */}
          {formData.projectId && (
            <div className="bg-primary/10 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-foreground">关联信息预览</h4>
              <p className="text-sm text-muted-foreground">
                项目：{projects.find(p => p.id === formData.projectId)?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                客户：{projects.find(p => p.id === formData.projectId)?.client_name}
              </p>
              <p className="text-sm text-muted-foreground">
                金额：{formData.transactionType} ￥{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0'}
              </p>
            </div>
          )}
          
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