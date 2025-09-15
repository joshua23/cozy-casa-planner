import React, { useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentNodes, type PaymentNode, type PaymentNodeFormData } from '@/hooks/usePaymentNodes';
import { useToast } from '@/hooks/use-toast';

interface PaymentNodesManagerProps {
  projectId: string;
  projectName: string;
  totalContractAmount?: number;
}

/**
 * 付款节点管理组件
 * 提供付款节点的查看、添加、编辑、删除功能
 */
export function PaymentNodesManager({ 
  projectId, 
  projectName, 
  totalContractAmount = 0 
}: PaymentNodesManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<PaymentNode | null>(null);
  const [formData, setFormData] = useState<PaymentNodeFormData>({
    node_type: '定金',
    amount: 0,
    paid_amount: 0,
    due_date: '',
    status: '未付'
  });

  const { 
    paymentNodes, 
    loading, 
    error, 
    addPaymentNode, 
    updatePaymentNode, 
    deletePaymentNode,
    createDefaultPaymentNodes,
    getPaymentStats
  } = usePaymentNodes(projectId);

  const { toast } = useToast();
  const stats = getPaymentStats();

  // 重置表单
  const resetForm = () => {
    setFormData({
      node_type: '定金',
      amount: 0,
      paid_amount: 0,
      due_date: '',
      status: '未付'
    });
    setEditingNode(null);
  };

  // 处理添加/编辑付款节点
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNode) {
        await updatePaymentNode(editingNode.id, formData);
        toast({
          title: "更新成功",
          description: "付款节点已更新",
        });
      } else {
        await addPaymentNode(projectId, formData);
        toast({
          title: "添加成功",
          description: "付款节点已添加",
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "操作失败",
        variant: "destructive",
      });
    }
  };

  // 处理删除付款节点
  const handleDelete = async (nodeId: string) => {
    if (!confirm('确定要删除这个付款节点吗？')) return;

    try {
      await deletePaymentNode(nodeId);
      toast({
        title: "删除成功",
        description: "付款节点已删除",
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "删除失败",
        variant: "destructive",
      });
    }
  };

  // 处理编辑付款节点
  const handleEdit = (node: PaymentNode) => {
    setEditingNode(node);
    setFormData({
      node_type: node.node_type,
      amount: node.amount,
      paid_amount: node.paid_amount,
      due_date: node.due_date || '',
      status: node.status
    });
    setIsAddDialogOpen(true);
  };

  // 创建默认付款节点
  const handleCreateDefault = async () => {
    if (totalContractAmount <= 0) {
      toast({
        title: "无法创建",
        description: "项目合同金额无效",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('确定要创建默认付款节点吗？这将覆盖现有的付款节点。')) return;

    try {
      await createDefaultPaymentNodes(projectId, totalContractAmount);
      toast({
        title: "创建成功",
        description: "默认付款节点已创建",
      });
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建失败",
        variant: "destructive",
      });
    }
  };

  // 获取付款状态颜色
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "已付": return "text-stat-green bg-stat-green/10";
      case "部分": return "text-stat-orange bg-stat-orange/10";
      case "未付": return "text-stat-red bg-stat-red/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `￥${(amount / 10000).toFixed(1)}万`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>付款节点</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载付款节点中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>付款节点</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">加载付款节点失败：{error}</p>
            <Button onClick={() => window.location.reload()}>重试</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>付款节点</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {paymentNodes.length === 0 && totalContractAmount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateDefault}
              >
                创建默认节点
              </Button>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加节点
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingNode ? '编辑付款节点' : '添加付款节点'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="node_type">节点类型</Label>
                    <Select 
                      value={formData.node_type} 
                      onValueChange={(value: PaymentNode['node_type']) => 
                        setFormData(prev => ({ ...prev, node_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="定金">定金</SelectItem>
                        <SelectItem value="一期工程款">一期工程款</SelectItem>
                        <SelectItem value="二期工程款">二期工程款</SelectItem>
                        <SelectItem value="三期工程款">三期工程款</SelectItem>
                        <SelectItem value="增项款">增项款</SelectItem>
                        <SelectItem value="尾款">尾款</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">应付金额</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        amount: Number(e.target.value) 
                      }))}
                      placeholder="请输入金额"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="paid_amount">已付金额</Label>
                    <Input
                      id="paid_amount"
                      type="number"
                      value={formData.paid_amount}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        paid_amount: Number(e.target.value) 
                      }))}
                      placeholder="请输入已付金额"
                    />
                  </div>

                  <div>
                    <Label htmlFor="due_date">付款日期</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        due_date: e.target.value 
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">付款状态</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: PaymentNode['status']) => 
                        setFormData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="未付">未付</SelectItem>
                        <SelectItem value="部分">部分</SelectItem>
                        <SelectItem value="已付">已付</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      取消
                    </Button>
                    <Button type="submit">
                      {editingNode ? '更新' : '添加'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentNodes.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">暂无付款节点</p>
            {totalContractAmount > 0 && (
              <Button variant="outline" onClick={handleCreateDefault}>
                创建默认付款节点
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* 付款统计 */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">付款进度</span>
                <span className="text-sm text-muted-foreground">
                  {formatAmount(stats.totalPaid)} / {formatAmount(stats.totalAmount)}
                </span>
              </div>
              <Progress value={stats.paymentProgress} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-stat-green">{stats.paidCount}</div>
                  <div className="text-xs text-muted-foreground">已付</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-stat-orange">{stats.partialCount}</div>
                  <div className="text-xs text-muted-foreground">部分</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-stat-red">{stats.unpaidCount}</div>
                  <div className="text-xs text-muted-foreground">未付</div>
                </div>
              </div>
            </div>

            {/* 付款节点列表 */}
            <div className="space-y-3">
              {paymentNodes.map((node) => (
                <div key={node.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{node.node_type}</span>
                      <Badge className={getPaymentStatusColor(node.status)}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(node)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(node.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">应付：</span>
                      <span className="font-medium">{formatAmount(node.amount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">已付：</span>
                      <span className="font-medium">{formatAmount(node.paid_amount)}</span>
                    </div>
                    {node.due_date && (
                      <div className="col-span-2 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">付款日期：</span>
                        <span>{node.due_date}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${node.amount > 0 ? (node.paid_amount / node.amount) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
