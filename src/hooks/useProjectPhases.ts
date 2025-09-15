import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectPhase {
  id: string;
  project_id: string;
  phase_name: string;
  phase_order: number;
  status: string; // 使用 string 类型以匹配数据库
  progress: number;
  start_date?: string;
  end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  estimated_duration: number;
  description?: string;
  dependencies?: string[];
  created_at: string;
  updated_at: string;
}

export function useProjectPhases(projectId?: string) {
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPhases = async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('project_phases')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_order', { ascending: true });

      if (error) throw error;
      setPhases(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取项目阶段失败';
      setError(errorMessage);
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePhaseStatus = async (phaseId: string, status: ProjectPhase['status'], progress?: number) => {
    try {
      const updateData: any = { status };
      
      if (progress !== undefined) {
        updateData.progress = progress;
      }

      // 自动设置实际开始和结束日期
      if (status === '进行中' && !phases.find(p => p.id === phaseId)?.actual_start_date) {
        updateData.actual_start_date = new Date().toISOString().split('T')[0];
      }
      
      if (status === '已完成') {
        updateData.actual_end_date = new Date().toISOString().split('T')[0];
        updateData.progress = 100;
      }

      const { error } = await supabase
        .from('project_phases')
        .update(updateData)
        .eq('id', phaseId);

      if (error) throw error;

      toast({
        title: "成功",
        description: "阶段状态已更新",
      });

      fetchPhases();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新阶段状态失败';
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updatePhaseProgress = async (phaseId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('project_phases')
        .update({ progress })
        .eq('id', phaseId);

      if (error) throw error;

      toast({
        title: "成功",
        description: "进度已更新",
      });

      fetchPhases();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新进度失败';
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updatePhaseDates = async (phaseId: string, startDate?: string, endDate?: string) => {
    try {
      const updateData: any = {};
      if (startDate) updateData.start_date = startDate;
      if (endDate) updateData.end_date = endDate;

      const { error } = await supabase
        .from('project_phases')
        .update(updateData)
        .eq('id', phaseId);

      if (error) throw error;

      toast({
        title: "成功",
        description: "阶段日期已更新",
      });

      fetchPhases();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新日期失败';
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPhases();
  }, [projectId]);

  return {
    phases,
    loading,
    error,
    updatePhaseStatus,
    updatePhaseProgress,
    updatePhaseDates,
    refetch: fetchPhases,
  };
}