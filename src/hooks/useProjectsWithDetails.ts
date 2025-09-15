import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectWithDetails {
  id: string;
  name: string;
  status: string;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  total_contract_amount?: number;
  property_type?: string;
  decoration_style?: string;
  area?: number;
  start_date?: string;
  end_date?: string;
  project_address?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_phases: Array<{
    id: string;
    phase_name: string;
    status: string;
    progress: number;
    completion_percentage: number;
    start_date?: string;
    end_date?: string;
    phase_order: number;
  }>;
  payment_nodes: Array<{
    id: string;
    node_type: string;
    amount: number;
    paid_amount: number;
    status: string;
    due_date?: string;
    created_at: string;
  }>;
}

/**
 * 优化的项目数据获取Hook
 * 使用单次查询获取项目及其所有关联数据，解决N+1查询问题
 */
export function useProjectsWithDetails() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectsWithDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取当前用户
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('用户未登录');
      }

      console.log('获取项目详细信息（包含阶段和付款节点）...');

      // 单次查询获取项目及其所有关联数据
      const { data, error: queryError } = await supabase
        .from('projects')
        .select(`
          *,
          project_phases (
            id,
            phase_name,
            status,
            progress,
            completion_percentage,
            start_date,
            end_date,
            phase_order,
            created_at
          ),
          payment_nodes (
            id,
            node_type,
            amount,
            paid_amount,
            status,
            due_date,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      console.log('获取到的项目数据（含关联）:', data);

      // 对每个项目的阶段按照phase_order排序
      const processedData = (data || []).map(project => ({
        ...project,
        project_phases: (project.project_phases || []).sort((a, b) => a.phase_order - b.phase_order),
        payment_nodes: (project.payment_nodes || []).sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }));

      setProjects(processedData);
    } catch (err) {
      console.error('获取项目详细信息失败:', err);
      setError(err instanceof Error ? err.message : '获取项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 刷新单个项目的数据
  const refreshProject = async (projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_phases (
            id,
            phase_name,
            status,
            progress,
            completion_percentage,
            start_date,
            end_date,
            phase_order,
            created_at
          ),
          payment_nodes (
            id,
            node_type,
            amount,
            paid_amount,
            status,
            due_date,
            created_at
          )
        `)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const processedProject = {
          ...data,
          project_phases: (data.project_phases || []).sort((a, b) => a.phase_order - b.phase_order),
          payment_nodes: (data.payment_nodes || []).sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        };

        setProjects(prev =>
          prev.map(p => p.id === projectId ? processedProject : p)
        );
      }
    } catch (err) {
      console.error('刷新项目数据失败:', err);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchProjectsWithDetails();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjectsWithDetails,
    refreshProject
  };
}