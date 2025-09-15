import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Receipt, Calendar, CreditCard, FileText, User } from "lucide-react";

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

interface FinanceDetailDialogProps {
  transaction: Transaction;
  children: React.ReactNode;
}

export function FinanceDetailDialog({ transaction, children }: FinanceDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Mock detailed transaction data - in real app, this would come from Supabase
  const transactionDetail = {
    ...transaction,
    invoiceNumber: "INV-2024-0156",
    paymentMethod: "银行转账",
    accountNumber: "622848***8888",
    operator: "张会计",
    approver: "李经理",
    createTime: "2024-01-20 14:30:22",
    attachments: [
      { name: "发票扫描件.pdf", size: "1.2MB" },
      { name: "收据.jpg", size: "856KB" }
    ],
    relatedContacts: {
      client: transaction.customerName || transaction.projectClientName || "张先生",
      phone: "138****1234",
      company: "海景地产"
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "收入": return "text-stat-green bg-stat-green/10";
      case "支出": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "text-stat-green bg-stat-green/10";
      case "待审核": return "text-stat-orange bg-stat-orange/10";
      case "处理中": return "text-stat-blue bg-stat-blue/10";
      case "已取消": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      currencyDisplay: 'symbol'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>交易详情</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">交易类型</p>
                <Badge className={getTypeColor(transactionDetail.type)}>
                  {transactionDetail.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">交易状态</p>
                <Badge className={getStatusColor(transactionDetail.status)}>
                  {transactionDetail.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">交易金额</p>
                <p className="text-lg font-bold text-foreground">
                  {formatAmount(transactionDetail.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">发票号码</p>
                <p className="font-medium text-foreground">{transactionDetail.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* 交易信息 */}
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>交易信息</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">分类</p>
                <p className="font-medium text-foreground">{transactionDetail.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">关联项目</p>
                <p className="font-medium text-foreground">{transactionDetail.project}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">交易日期</p>
                <p className="font-medium text-foreground">{transactionDetail.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">支付方式</p>
                <p className="font-medium text-foreground">{transactionDetail.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">账户信息</p>
                <p className="font-medium text-foreground">{transactionDetail.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium text-foreground">{transactionDetail.createTime}</p>
              </div>
            </div>
          </div>

          {/* 描述信息 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">描述信息</h4>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-foreground">{transactionDetail.description}</p>
            </div>
          </div>

          {/* 相关联系人 */}
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>相关联系人</span>
            </h4>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">客户姓名</p>
                  <p className="font-medium text-foreground">{transactionDetail.relatedContacts.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">联系电话</p>
                  <p className="font-medium text-foreground">{transactionDetail.relatedContacts.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">所属公司</p>
                  <p className="font-medium text-foreground">{transactionDetail.relatedContacts.company}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 操作记录 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">操作记录</h4>
            <div className="space-y-2">
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">录入员</p>
                    <p className="text-sm text-muted-foreground">{transactionDetail.operator}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{transactionDetail.createTime}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">审核员</p>
                    <p className="text-sm text-muted-foreground">{transactionDetail.approver}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2024-01-20 15:45:33</p>
                </div>
              </div>
            </div>
          </div>

          {/* 附件 */}
          <div>
            <h4 className="font-medium text-foreground mb-3">附件</h4>
            <div className="space-y-2">
              {transactionDetail.attachments.map((file, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{file.name}</span>
                    <span className="text-sm text-muted-foreground">({file.size})</span>
                  </div>
                  <Button size="sm" variant="outline">
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              toast({
                title: "导出记录",
                description: "交易记录已导出为PDF文件",
              });
            }}>
              导出PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}