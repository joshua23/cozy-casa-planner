import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentNode {
  id: string;
  project_id: string;
  node_type: '合同总价' | '定金' | '一期工程款' | '二期工程款' | '三期工程款' | '增项款' | '尾款';
  amount: number;
  paid_amount: number;
  due_date?: string;
  status: '未付' | '部分' | '已付';
  created_at: string;
}

export interface PaymentNodeFormData {
  node_type: PaymentNode['node_type'];
  amount: number;
  paid_amount: number;
  due_date?: string;
  status: PaymentNode['status'];
}

/**
 * 付款节点管理Hook
 * 提供付款节点的增删改查功能
 */
export function usePaymentNodes(projectId?: string) {
  const [paymentNodes, setPaymentNodes] = useState<PaymentNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取付款节点列表
  const fetchPaymentNodes = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('payment_nodes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setPaymentNodes(data || []);
    } catch (err) {
      console.error('获取付款节点失败:', err);
      setError(err instanceof Error ? err.message : '获取付款节点失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加付款节点
  const addPaymentNode = async (projectId: string, nodeData: PaymentNodeFormData) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('payment_nodes')
        .insert({
          project_id: projectId,
          ...nodeData
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentNodes(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('添加付款节点失败:', err);
      setError(err instanceof Error ? err.message : '添加付款节点失败');
      throw err;
    }
  };

  // 更新付款节点
  const updatePaymentNode = async (nodeId: string, nodeData: Partial<PaymentNodeFormData>) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('payment_nodes')
        .update(nodeData)
        .eq('id', nodeId)
        .select()
        .single();

      if (error) throw error;

      setPaymentNodes(prev => 
        prev.map(node => node.id === nodeId ? data : node)
      );
      return data;
    } catch (err) {
      console.error('更新付款节点失败:', err);
      setError(err instanceof Error ? err.message : '更新付款节点失败');
      throw err;
    }
  };

  // 删除付款节点
  const deletePaymentNode = async (nodeId: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('payment_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      setPaymentNodes(prev => prev.filter(node => node.id !== nodeId));
    } catch (err) {
      console.error('删除付款节点失败:', err);
      setError(err instanceof Error ? err.message : '删除付款节点失败');
      throw err;
    }
  };

  // 批量创建默认付款节点
  const createDefaultPaymentNodes = async (projectId: string, totalAmount: number) => {
    try {
      setError(null);

      // 计算各节点金额
      const depositAmount = Math.round(totalAmount * 0.2); // 定金20%
      const firstPhaseAmount = Math.round(totalAmount * 0.3); // 一期30%
      const secondPhaseAmount = Math.round(totalAmount * 0.3); // 二期30%
      const finalAmount = totalAmount - depositAmount - firstPhaseAmount - secondPhaseAmount; // 尾款

      const defaultNodes: Omit<PaymentNode, 'id' | 'created_at'>[] = [
        {
          project_id: projectId,
          node_type: '定金',
          amount: depositAmount,
          paid_amount: 0,
          status: '未付'
        },
        {
          project_id: projectId,
          node_type: '一期工程款',
          amount: firstPhaseAmount,
          paid_amount: 0,
          status: '未付'
        },
        {
          project_id: projectId,
          node_type: '二期工程款',
          amount: secondPhaseAmount,
          paid_amount: 0,
          status: '未付'
        },
        {
          project_id: projectId,
          node_type: '尾款',
          amount: finalAmount,
          paid_amount: 0,
          status: '未付'
        }
      ];

      const { data, error } = await supabase
        .from('payment_nodes')
        .insert(defaultNodes)
        .select();

      if (error) throw error;

      setPaymentNodes(prev => [...prev, ...data]);
      return data;
    } catch (err) {
      console.error('创建默认付款节点失败:', err);
      setError(err instanceof Error ? err.message : '创建默认付款节点失败');
      throw err;
    }
  };

  // 自动更新付款状态
  const updatePaymentStatus = (node: PaymentNode): PaymentNode['status'] => {
    if (node.paid_amount >= node.amount) {
      return '已付';
    } else if (node.paid_amount > 0) {
      return '部分';
    } else {
      return '未付';
    }
  };

  // 计算付款统计
  const getPaymentStats = () => {
    const totalAmount = paymentNodes.reduce((sum, node) => sum + node.amount, 0);
    const totalPaid = paymentNodes.reduce((sum, node) => sum + node.paid_amount, 0);
    const totalUnpaid = totalAmount - totalPaid;
    const paidCount = paymentNodes.filter(node => node.status === '已付').length;
    const partialCount = paymentNodes.filter(node => node.status === '部分').length;
    const unpaidCount = paymentNodes.filter(node => node.status === '未付').length;

    return {
      totalAmount,
      totalPaid,
      totalUnpaid,
      paidCount,
      partialCount,
      unpaidCount,
      paymentProgress: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0
    };
  };

  // 当projectId变化时自动获取数据
  useEffect(() => {
    if (projectId) {
      fetchPaymentNodes(projectId);
    } else {
      setPaymentNodes([]);
    }
  }, [projectId]);

  return {
    paymentNodes,
    loading,
    error,
    fetchPaymentNodes,
    addPaymentNode,
    updatePaymentNode,
    deletePaymentNode,
    createDefaultPaymentNodes,
    updatePaymentStatus,
    getPaymentStats
  };
}
